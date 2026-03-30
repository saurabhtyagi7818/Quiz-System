import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, BarChart3, Settings, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '' });
    const [newQuestion, setNewQuestion] = useState({
        quiz_id: '', text: '',
        options: ['', '', '', ''],
        correct_index: 0
    });
    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            const [sRes, qRes] = await Promise.all([
                axios.get('http://localhost:5000/api/analytics/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/quiz', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStats(sRes.data);
            setQuizzes(qRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, [token]);

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/quiz', newQuiz, { headers: { Authorization: `Bearer ${token}` } });
            setNewQuiz({ title: '', description: '' });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/quiz/${newQuestion.quiz_id}/questions`, newQuestion, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewQuestion({ quiz_id: '', text: '', options: ['', '', '', ''], correct_index: 0 });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl bg-indigo-600/10 border-indigo-500/20">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Attempts</p>
                    <h3 className="text-4xl font-bold mt-2">{stats?.totalAttempts || 0}</h3>
                </div>
                <div className="glass p-6 rounded-2xl bg-emerald-600/10 border-emerald-500/20">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Live Quizzes</p>
                    <h3 className="text-4xl font-bold mt-2">{stats?.totalQuizzes || 0}</h3>
                </div>
                <div className="glass p-6 rounded-2xl bg-orange-600/10 border-orange-500/20">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Avg. Engagement</p>
                    <h3 className="text-4xl font-bold mt-2">{stats?.totalQuizzes ? (stats.totalAttempts / stats.totalQuizzes).toFixed(1) : 0}</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><Plus className="text-indigo-400" /> Management</h2>

                    <form onSubmit={handleCreateQuiz} className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-indigo-300">Create New Quiz</h3>
                        <input
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Quiz Title"
                            value={newQuiz.title}
                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                        />
                        <textarea
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                            placeholder="Description"
                            value={newQuiz.description}
                            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                        />
                        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors">Create Quiz</button>
                    </form>

                    <form onSubmit={handleCreateQuestion} className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-indigo-300">Add Question</h3>
                        <select
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg"
                            value={newQuestion.quiz_id}
                            onChange={(e) => setNewQuestion({ ...newQuestion, quiz_id: e.target.value })}
                            required
                        >
                            <option value="">Select Quiz</option>
                            {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
                        </select>
                        <input
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg outline-none"
                            placeholder="Question text"
                            value={newQuestion.text}
                            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-2 gap-2">
                            {newQuestion.options.map((opt, i) => (
                                <input
                                    key={i}
                                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => {
                                        const opts = [...newQuestion.options];
                                        opts[i] = e.target.value;
                                        setNewQuestion({ ...newQuestion, options: opts });
                                    }}
                                    required
                                />
                            ))}
                        </div>
                        <select
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg"
                            value={newQuestion.correct_index}
                            onChange={(e) => setNewQuestion({ ...newQuestion, correct_index: parseInt(e.target.value) })}
                        >
                            <option value={0}>Option A is Correct</option>
                            <option value={1}>Option B is Correct</option>
                            <option value={2}>Option C is Correct</option>
                            <option value={3}>Option D is Correct</option>
                        </select>
                        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">Add Question</button>
                    </form>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-indigo-400" /> Analytics</h2>
                    <div className="glass p-6 rounded-2xl space-y-8">
                        {stats?.quizStats.map((q, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold">{q.title}</span>
                                    <span className="text-indigo-400">{q.avgScore.toFixed(1)} Avg. Score</span>
                                </div>
                                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-1000"
                                        style={{ width: `${(q.avgScore / 10) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500">{q.count} total attempts</p>
                            </div>
                        ))}
                        {!stats?.quizStats.length && <p className="text-center text-slate-500 py-10">No data available yet.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
