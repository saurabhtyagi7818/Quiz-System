import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, ArrowRight } from 'lucide-react';
import './auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', { email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <UserPlus size={28} color="#fff" />
                    </div>
                    <h2 className="auth-title">Join the Quiz Portal</h2>
                    <p className="auth-subtitle">Create your account to get started</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                <div className="auth-form-group">
                    <div className="input-wrapper">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                    {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
                </button>

                <p className="auth-footer">
                    Already a member? <Link to="/login" className="login-link">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;