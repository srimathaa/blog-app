import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createPost } from '../api/posts';
import { uploadImage } from '../api/upload';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // local preview before upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let coverImage = '';

      // Upload image first (if one was selected), then create the post
      if (imageFile) {
        setUploading(true);
        const uploadRes = await uploadImage(imageFile);
        coverImage = uploadRes.data.url;
        setUploading(false);
      }

      const payload = {
        ...form,
        coverImage,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const res = await createPost(payload);
      toast.success('Post created!');
      navigate(`/posts/${res.data.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Write a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full mt-3 rounded-lg max-h-64 object-cover" />
          )}
        </div>

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
            placeholder="A short summary of your post"
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
            placeholder="react, javascript, webdev"
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

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading image...' : submitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;