'use client';

import { useEffect, useState } from 'react';

type Role = 'admin' | 'subadmin';

type SubAdmin = {
    _id: string;
    name: string;
    role: Role;
    createdAt?: string;
};


export default function SubAdmins() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
    const [filtered, setFiltered] = useState<SubAdmin[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ name: '', password: '', role: 'subadmin' as Role });
    const [deleteTarget, setDeleteTarget] = useState<SubAdmin | null>(null);
    const [deleting, setDeleting] = useState(false);

    /* Fetch all sub admins */
    useEffect(() => {
        fetch('http://localhost:3001/dns-admin/subadmins', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {

                setSubAdmins(data.list ?? []);
                setFiltered(data.list ?? []);
            })
            .finally(() => setLoading(false));
    }, []);

    /* Search by name */
    useEffect(() => {
        setFiltered(
            subAdmins.filter(a =>
                a.name.toLowerCase().includes(search.toLowerCase()),
            ),
        );
    }, [search, subAdmins]);

    /* Create subadmin */
    async function createSubAdmin() {
        if (!form.name || !form.password) {
            alert('Name & password required');
            return;
        }

        const res = await fetch(
            'http://localhost:3001/dns-admin/create-subadmin',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form),
            },
        );

        const data = await res.json();

        if (res.ok) {
            setSubAdmins(prev => [data.subAdmin, ...prev]);
            setForm({ name: '', password: '', role: "subadmin" });
            setAdding(false);
        } else {
            alert(data.message ?? 'Failed to create sub admin');
        }
    }

    /* Delete subadmin */

    async function confirmDelete() {
        if (!deleteTarget) return;

        setDeleting(true);

        const res = await fetch(
            'http://localhost:3001/dns-admin/delete-subadmin',
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: deleteTarget.name }),
            },
        );

        if (res.ok) {
            setSubAdmins(prev =>
                prev.filter(a => a.name !== deleteTarget.name),
            );
            setDeleteTarget(null);
        }

        setDeleting(false);
    }


    if (loading) return <div className="text-slate-400">Loading sub admins...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Sub Admins</h2>

            {/* Add */}
            <div className="mb-4">
                {adding ? (
                    <div className="flex gap-2">
                        <input
                            placeholder="Username"
                            className="p-2 rounded bg-slate-800 text-white flex-1"
                            value={form.name}
                            onChange={e =>
                                setForm(prev => ({ ...prev, name: e.target.value }))
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="p-2 rounded bg-slate-800 text-white flex-1"
                            value={form.password}
                            onChange={e =>
                                setForm(prev => ({ ...prev, password: e.target.value }))
                            }
                        />

                        {/* ROLE SELECT */}
                        <select
                            className="p-2 rounded bg-slate-800 text-white"
                            value={form.role}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    role: e.target.value as Role,
                                }))
                            }
                        >
                            <option value="subadmin">Sub Admin</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button
                            onClick={createSubAdmin}
                            className="bg-green-600 px-3 py-2 rounded text-white"
                        >
                            Add
                        </button>

                        <button
                            onClick={() => setAdding(false)}
                            className="bg-gray-600 px-3 py-2 rounded text-white"
                        >
                            Cancel
                        </button>
                    </div>

                ) : (
                    <button
                        onClick={() => setAdding(true)}
                        className="bg-green-600 px-4 py-2 rounded text-white text-sm"
                    >
                        + Create Sub Admin
                    </button>
                )}
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 p-2 rounded bg-slate-800 text-white w-full"
            />

            {/* List */}
            <ul className="space-y-2 text-slate-300 text-sm">
                {filtered.length ? (
                    filtered.map(a => (
                        <li
                            key={a._id}
                            className="border-b border-slate-800 pb-2 flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium">{a.name}</div>
                                <div className="text-xs text-slate-500">{a.role}</div>
                            </div>

                            <button
                                onClick={() => setDeleteTarget(a)}
                                className="bg-red-600 px-2 py-1 rounded text-white"
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-slate-500">No sub admins found</li>
                )}
            </ul>

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Delete Sub Admin
                        </h3>

                        <p className="text-slate-400 text-sm mb-4">
                            Are you sure you want to delete{' '}
                            <span className="text-white font-medium">
                                {deleteTarget.name}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 rounded bg-slate-700 text-white"
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}
