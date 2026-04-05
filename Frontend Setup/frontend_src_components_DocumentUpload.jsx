import { useState } from 'react';
import axios from 'axios';

export default function DocumentUpload({ domainId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domainId', domainId);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/documents/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document uploaded successfully');
      setFile(null);
    } catch (error) {
      alert('Upload failed: ' + error.response?.data?.error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".txt,.pdf,.md"
      />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </form>
  );
}