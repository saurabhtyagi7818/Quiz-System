import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizPlayer from './pages/QuizPlayer';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
                <Navbar />
                <main className="mx-auto w-full max-w-6xl px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/quiz/:id" element={token ? <QuizPlayer /> : <Navigate to="/login" />} />
                        <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
