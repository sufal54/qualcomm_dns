'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                body: JSON.stringify({ name, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            console.log('Logged in:', data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl"
            >
                <h1 className="text-2xl font-semibold text-white text-center mb-6">
                    Admin Login
                </h1>

                <motion.input
                    whileFocus={{ scale: 1.02 }}
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mb-3 text-center"
                    >
                        {error}
                    </motion.p>
                )}

                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-sky-400 text-slate-900 font-semibold hover:bg-sky-300 transition disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </motion.button>
            </motion.form>
        </div>
    );
}
