import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article className="relative bg-white pl-6 pr-6 py-5 mb-5 border border-[var(--color-ink)]/10 rounded-r-md overflow-hidden group hover:border-[var(--color-pine)]/40 transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-pine)]" />

      <Link to={`/posts/${post.slug}`}>
        <h2
          className="text-2xl font-semibold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-pine)] transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-[var(--color-ink)]/70 mb-4 leading-relaxed">{post.excerpt}</p>
        )}
        <div
          className="flex justify-between items-center text-xs text-[var(--color-muted)] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <span>{post.author?.name || 'Unknown'}</span>
          <div className="flex gap-4">
            <span>{post.views} reads</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </Link>

      {post.tags?.length > 0 && (
        <div className="flex gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${tag}`}
              className="text-[11px] uppercase tracking-wide px-2.5 py-1 border border-[var(--color-gold)] text-[var(--color-gold)] rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;