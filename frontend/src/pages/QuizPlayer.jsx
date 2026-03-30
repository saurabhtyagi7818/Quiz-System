import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send } from 'lucide-react';

const QuizPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/quiz/${id}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(res.data);
                setAnswers(new Array(res.data.length).fill(null));
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuestions();
    }, [id, token]);

    const handleSelect = (optionIdx) => {
        const newAnswers = [...answers];
        newAnswers[currentIdx] = optionIdx;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/attempt', {
                quiz_id: id,
                answers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;
    if (questions.length === 0) return <div className="text-center py-20">No questions available for this quiz.</div>;

    const currentQ = questions[currentIdx];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl">
                <span className="text-slate-400 font-medium">Question {currentIdx + 1} of {questions.length}</span>
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <Clock size={20} />
                    <span>Interactive Session</span>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-8">
                <h2 className="text-2xl font-semibold leading-relaxed">{currentQ.text}</h2>

                <div className="space-y-4">
                    {currentQ.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all ${answers[currentIdx] === idx
                                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${answers[currentIdx] === idx ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-lg">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between gap-4">
                <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {currentIdx === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Send size={18} />
                        <span>Finish Quiz</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentIdx(currentIdx + 1)}
                        className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPlayer;
