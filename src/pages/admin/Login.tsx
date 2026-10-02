import { useState } from 'react';
import { m } from 'framer-motion';
import Logo from '../../assets/logo';
import hero from '../../assets/bgMountainview.jpeg';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Empty = same origin (/api on Vercel, or the Vite dev proxy locally)
const API_URL = import.meta.env.VITE_API_URL ?? "";

const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-gold/70 focus:bg-white/[0.07]";

export default function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Already signed in: skip the form
    if (user) return <Navigate to={redirectTo} replace />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.user, data.token);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            const message = err instanceof TypeError
                ? 'Cannot reach the server. Please try again.'
                : err instanceof Error ? err.message : 'Login failed';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink px-4">
            <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 animate-kenburns" />
            <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/80 to-ink" />

            <Link
                to="/"
                className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold"
            >
                <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>

            <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-ink-2/85 p-8 sm:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="[&>svg]:h-14 [&>svg]:w-auto"><Logo /></div>
                    <p className="mt-4 text-xs uppercase tracking-[0.4em] text-gold">Staff area</p>
                    <h1 className="mt-2 font-display text-4xl font-semibold">Welcome back</h1>
                    <p className="mt-2 text-sm text-white/55">Sign in to manage the menu</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {error && (
                        <m.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            role="alert"
                            className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </m.div>
                    )}

                    <div className="relative">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address"
                            className={inputCls}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={`${inputCls} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-gold"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(255,184,43,0.8)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
                    >
                        {submitting
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                        {submitting ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-8 border-t border-white/5 pt-5 text-center text-xs text-white/35">
                    &copy; {new Date().getFullYear()} Mountain View Hotel & Apartments
                </p>
            </m.div>
        </div>
    );
}
