import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-paper)] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h2
            className="text-4xl font-bold text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome back
          </h2>
          <p className="text-[var(--color-muted)] mt-2 text-sm">Sign in to keep writing</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              className="block text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border-b-2 border-[var(--color-ink)]/20 focus:border-[var(--color-pine)] outline-none py-2 bg-transparent transition-colors"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1.5"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full border-b-2 border-[var(--color-ink)]/20 focus:border-[var(--color-pine)] outline-none py-2 bg-transparent transition-colors"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-pine)] text-white py-3 rounded-full font-medium hover:bg-[var(--color-pine-dark)] transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-muted)] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--color-pine)] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;