import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getComments, addComment } from '../api/comments';
import { useAuth } from '../hooks/useAuth';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(postId);
        setComments(res.data);
      } catch (err) {
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await addComment(postId, text);
      setComments((prev) => [res.data, ...prev]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded px-3 py-2 mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-6">Log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">{comment.author?.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;