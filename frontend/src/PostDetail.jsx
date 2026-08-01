import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.sub || payload.userId;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const fetchPost = () => {
    fetch(`${API_URL}/api/posts/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch post');
        }
        setPost(data);
      })
      .catch((err) => {
        console.error('Error fetching post:', err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to comment.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to post comment');
      }

      setCommentText('');
      fetchPost();
    } catch (err) {
      console.error('Error posting comment:', err);
      alert(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete comment');
      }

      fetchPost();
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.message);
    }
  };

  if (error) {
    return <div className="main-content"><p className="empty-state" style={{ color: 'red' }}>Error: {error}</p></div>;
  }

  if (!post) {
    return <div className="main-content"><p className="empty-state">Loading...</p></div>;
  }

  return (
    <div className="main-content" style={{ maxWidth: '720px' }}>
      <article className="post-card" style={{ cursor: 'default', boxShadow: 'none' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#09090b', marginBottom: '1rem' }}>{post.title}</h1>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          By {post.author?.username || 'Anonymous'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
        </p>
        <div style={{ color: '#27272a', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
          {post.content}
        </div>

        <section style={{ borderTop: '1px solid #e4e4e7', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Comments</h3>
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <textarea 
              placeholder="Write a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)} 
              required 
              rows="3"
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e4e4e7', fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Post Comment</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const commentUserId = comment.userId || comment.authorId;
                const isOwner = currentUserId && Number(commentUserId) === Number(currentUserId);

                return (
                  <div key={comment.id} style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px', border: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#09090b', marginBottom: '0.25rem' }}>
                        {comment.user?.username || comment.author?.username || 'Anonymous'}
                      </p>
                      <p style={{ fontSize: '0.95rem', color: '#3f3f46' }}>{comment.content}</p>
                    </div>
                    {isOwner && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)} 
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#71717a', fontSize: '0.9rem' }}>No comments yet.</p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}