import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPostById, updatePost, deletePost } from '../api/posts';
import { useAuth } from '../hooks/useAuth';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [postAuthorId, setPostAuthorId] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(id);
        const data = res.data;

        setForm({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          tags: data.tags?.join(', ') || '',
          status: data.status,
        });
        setPostAuthorId(data.author?._id || data.author);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await updatePost(id, payload);
      toast.success('Post updated!');
      navigate(`/posts/${res.data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }
    try {
      await deletePost(id);
      toast.success('Post deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (user && postAuthorId && user._id !== postAuthorId) {
    return <div className="p-8 text-center text-red-500">You are not authorized to edit this post.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Excerpt</label>
          <input
            type="text"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;