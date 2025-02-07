import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Home from './pages/Home';
import AcademyFeed from './pages/AcademyFeed';
import Directory from './pages/Directory';
import Messages from './pages/Messages';
import Auth from './pages/Auth';
import { useAuthStore } from './stores/authStore';

function App() {
  const { session } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-[#231F20] text-white">
        {session ? (
          <>
            <Navbar />
            <main className="container mx-auto px-4 pt-20 pb-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/academy" element={<AcademyFeed />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
            </main>
            <BottomNav />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        )}
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;