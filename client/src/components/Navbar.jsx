import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-[var(--color-paper)] border-b-2 border-[var(--color-ink)]">
      <nav className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-end">
        <Link to="/" className="flex flex-col">
          <span
            className="text-3xl font-bold tracking-tight text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The BlogApp
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mt-1"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Ideas, worth writing down
          </span>
        </Link>

        <div className="flex gap-5 items-center">
          {user ? (
            <>
              <Link
                to="/create"
                className="text-sm font-medium text-[var(--color-pine)] hover:text-[var(--color-pine-dark)] transition-colors"
              >
                Write
              </Link>
              <span
                className="text-xs text-[var(--color-muted)] uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-1.5 border border-[var(--color-ink)] rounded-full hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-pine)] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-1.5 bg-[var(--color-pine)] text-white rounded-full hover:bg-[var(--color-pine-dark)] transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;