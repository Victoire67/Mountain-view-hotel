import { useState } from 'react';
import Logo from '../../assets/logo';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`{API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        }
    };

    return (
        <div className="bg relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/95 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <Logo />
                    <h1 className="text-2xl font-bold tracking-tight text-gray-800 text-center">
                        Mountain View
                    </h1>
                    <p className="text-sm text-gray-500 text-center font-medium mt-0.5">
                        Hotel & Apartment
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Error banner — this also fixes the "declared but never read" warning */}
                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                            Email Address / Username
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                id="email"
                                type="text"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800 text-sm bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-gray-800 text-sm bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <label className="flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-2 font-medium">Remember me</span>
                        </label>

                        <a href="#forgot" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-[#FFB82B] cursor-pointer hover:bg-emerald-800 text-white font-semibold active:bg-green-500 text-sm transition duration-150 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Mountain View Hotel & Apartment. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}