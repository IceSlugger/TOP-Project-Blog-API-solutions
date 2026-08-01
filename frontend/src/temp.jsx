import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error('Failed to create post');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Create Post</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7' }}
        />
        <textarea 
          placeholder="Write your post content here..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          rows="8"
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7', fontFamily: 'inherit' }}
        />
        <button type="submit" className="btn-primary">Publish Post</button>
      </form>
    </div>
  );
}