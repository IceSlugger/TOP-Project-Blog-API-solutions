import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import PostDetail from './PostDetail';
import Login from './login';
import Register from './Register';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Writing.</h1>
        <p className="text-sm text-zinc-500 mt-1">Thoughts, notes, and code snippets.</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="p-6 bg-white rounded-xl border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all"
          >
            <Link to={`/posts/${post.id}`} className="group block">
              <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-600 text-sm mt-2 line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">
                <span>{post.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* Navbar */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-sm tracking-tight">myblog.dev</Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
            {token ? (
              <>
                <Link to="/create" className="hover:text-zinc-900 transition-colors">Create Post</Link>
                <button onClick={handleLogout} className="hover:text-red-600 transition-colors cursor-pointer">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-zinc-900 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}