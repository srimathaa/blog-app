import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../api/posts';
import { useAuth } from '../hooks/useAuth';
import CommentSection from '../components/CommentSection';


const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostBySlug(slug);
        setPost(res.data);
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;

  return (
    
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
        <span>
          By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()} • {post.views} views
        </span>
        {isAuthor && (
          <Link to={`/edit/${post._id}`} className="text-blue-600 hover:underline">
            Edit Post
          </Link>
        )}
      </div>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full rounded-lg mb-6" />
      )}

      <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">{post.content}</div>

      {post.tags?.length > 0 && (
        <div className="flex gap-2 mt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <CommentSection postId={post._id} />
    </div>
    
  );
};

export default PostDetail;