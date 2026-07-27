import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '../api/posts';
import PostCard from '../components/PostCard';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFilter = searchParams.get('tag');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (search) params.search = search;
        if (tagFilter) params.tag = tagFilter;

        const res = await getPosts(params);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, search, tagFilter]);

  const clearTagFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-10 pb-6 border-b border-[var(--color-ink)]/10">
        <h1
          className="text-5xl font-bold text-[var(--color-ink)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Latest Posts
        </h1>
        <p className="text-[var(--color-muted)]">Writing on things worth thinking about.</p>
      </div>

      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search posts..."
        className="w-full border rounded px-3 py-2 mb-4"
      />

      {tagFilter && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-gray-600">Filtering by tag:</span>
          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{tagFilter}</span>
          <button onClick={clearTagFilter} className="text-sm text-red-500 hover:underline">
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;