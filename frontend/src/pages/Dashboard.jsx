import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, PlayCircle, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const [qRes, aRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/quiz', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/attempt/my', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setQuizzes(qRes.data);
                setAttempts(aRes.data);
            } catch (err) {
                console.error(err);
                setError('Could not load dashboard data. Please refresh.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const getScoreMeta = (attempt) => {
        const total = Array.isArray(attempt.answers) ? attempt.answers.length : 0;
        const safeTotal = total > 0 ? total : null;
        const percent = safeTotal ? Math.round((attempt.score / safeTotal) * 100) : null;
        const passed = percent !== null ? percent >= 40 : attempt.score > 0;
        return { safeTotal, percent, passed };
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white">Student Dashboard</h1>
                    <p className="text-slate-400 mt-1">Track your progress and take new challenges.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completed</p>
                        <p className="text-2xl font-mono font-bold text-indigo-400">{attempts.length}</p>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 text-slate-300">
                    Loading dashboard...
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
                    {error}
                </div>
            )}

            {/* Quizzes Grid */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BookOpen className="text-indigo-400 w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Available Quizzes</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && quizzes.length === 0 && (
                        <div className="col-span-full rounded-2xl border border-slate-700 bg-slate-800/30 p-6 text-slate-300">
                            No quizzes available yet. Ask admin to add one quiz and questions.
                        </div>
                    )}
                    {quizzes.map(quiz => (
                        <div key={quiz._id} className="relative group bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/50 transition-all hover:border-indigo-500/50 shadow-xl overflow-hidden">
                            
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{quiz.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
                                {quiz.description || "Challenge yourself with this quiz and test your knowledge level."}
                            </p>
                            
                            <Link
                                to={`/quiz/${quiz._id}`}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl font-bold transition-all"
                            >
                                Start Quiz <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Results Table */}
            <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Trophy className="text-orange-400 w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Performance History</h2>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/80 text-slate-300 uppercase text-xs tracking-widest font-bold">
                                    <th className="px-8 py-5">Quiz Details</th>
                                    <th className="px-8 py-5">Score</th>
                                    <th className="px-8 py-5">Date Attempted</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {attempts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-16 text-center text-slate-500 italic">No records found. Take a quiz to see your results!</td>
                                    </tr>
                                ) : (
                                    attempts.map(attempt => (
                                        <tr key={attempt._id} className="hover:bg-indigo-500/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{attempt.quiz_id?.title}</div>
                                                <div className="text-xs text-slate-500 mt-1">Quiz ID: {attempt._id.slice(-6)}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {(() => {
                                                    const { safeTotal, percent } = getScoreMeta(attempt);
                                                    return (
                                                <span className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full text-sm font-mono font-bold border border-indigo-500/20">
                                                    {safeTotal ? `${attempt.score}/${safeTotal} (${percent}%)` : `${attempt.score} Points`}
                                                </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-8 py-6 text-slate-400 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {new Date(attempt.completed_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {(() => {
                                                    const { passed } = getScoreMeta(attempt);
                                                    return (
                                                        <span className={`text-xs font-bold px-3 py-1 rounded-md border ${passed
                                                            ? 'text-green-500 bg-green-500/10 border-green-500/20'
                                                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                                                            }`}>
                                                            {passed ? 'Passed' : 'Needs Practice'}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;