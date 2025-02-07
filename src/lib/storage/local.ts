import type { StorageAdapter } from './adapter';
import type { UploadResult } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  private baseUrl = 'http://localhost:3000/storage';

  async upload(bucket: string, path: string, file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('path', path);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return {
      path: result.path,
      url: this.getUrl(bucket, result.path),
    };
  }

  getUrl(bucket: string, path: string): string {
    return `${this.baseUrl}/${bucket}/${path}`;
  }

  async remove(bucket: string, path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucket, path }),
    });

    if (!response.ok) {
      throw new Error('Remove failed');
    }
  }
}