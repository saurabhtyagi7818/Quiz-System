import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-indigo-400">
                <Layout size={24} />
                <span>QuizMaster</span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base">
                {token ? (
                    <>
                        <Link to="/" className="text-slate-200 hover:text-indigo-400 transition-colors">Dashboard</Link>
                        {role === 'admin' && (
                            <Link to="/admin" className="text-indigo-300 hover:text-indigo-200 transition-colors font-semibold">Admin Panel</Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-200 hover:text-indigo-400 transition-colors">Login</Link>
                        <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors">Register</Link>
                    </>
                )}
            </div>
            </div>
        </nav>
    );
};

export default Navbar;
