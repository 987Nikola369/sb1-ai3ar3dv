import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  read: boolean;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string;
  };
  post_id?: string;
  message_id?: string;
}

export default function NotificationBell() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          read,
          created_at,
          post_id,
          message_id,
          sender:profiles!sender_id(username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(current => [payload.new as Notification, ...current]);
        setUnreadCount(count => count + 1);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications(current =>
      current.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(count => Math.max(0, count - 1));
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.sender.username} liked your post`;
      case 'comment':
        return `${notification.sender.username} commented on your post`;
      case 'message':
        return `New message from ${notification.sender.username}`;
      case 'announcement':
        return 'New academy announcement';
      default:
        return 'New notification';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    setShowDropdown(false);
    
    // Handle navigation based on notification type
    if (notification.type === 'message' && notification.message_id) {
      // Navigate to messages
      window.location.href = '/messages';
    } else if ((notification.type === 'like' || notification.type === 'comment') && notification.post_id) {
      // Navigate to the specific post
      window.location.href = `/post/${notification.post_id}`;
    } else if (notification.type === 'announcement') {
      // Navigate to academy
      window.location.href = '/academy';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-white hover:text-[#E41E12] transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E41E12] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#2A2627] rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-background-lighter transition-colors cursor-pointer ${
                    !notification.read ? 'bg-background/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={notification.sender.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${notification.sender.username}`}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-white">{getNotificationText(notification)}</p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(notification.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}