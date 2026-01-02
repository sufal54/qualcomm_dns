'use client';
import { useEffect, useState } from 'react';

type DnsRecord = {
    _id: string;
    domain: string;
    ip: string;
    ttl: number;
};

export default function DnsRecords() {
    const [records, setRecords] = useState<DnsRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<DnsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<{ domain: string; ip: string; ttl: number }>({
        domain: '',
        ip: '',
        ttl: 0,
    });
    const [newRecord, setNewRecord] = useState<{ domain: string; ip: string; ttl: number }>({
        domain: '',
        ip: '',
        ttl: 300,
    });

    const [adding, setAdding] = useState(false);


    // Fetch records
    useEffect(() => {
        async function fetchRecords() {
            try {
                const res = await fetch('http://localhost:3001/dns-record', { credentials: 'include' });
                const data = await res.json();
                console.log(data)
                setRecords(data.records ?? []);
                setFilteredRecords(data.records ?? []);
            } finally {
                setLoading(false);
            }
        }
        fetchRecords();
    }, []);

    // Search filtering
    useEffect(() => {
        setFilteredRecords(
            records.filter(r => r.domain.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, records]);

    // Delete record
    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this record?')) return;

        const res = await fetch(`http://localhost:3001/dns-admin/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (res.ok) {
            setRecords(prev => prev.filter(r => r._id !== id));
        } else {
            alert('Failed to delete record');
        }
    }

    // Start editing
    function startEdit(record: DnsRecord) {
        setEditingId(record._id);
        setEditData({ domain: record.domain, ip: record.ip, ttl: record.ttl });
    }

    // Save edit
    async function saveEdit(id: string) {
        const res = await fetch(`http://localhost:3001/dns-admin/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(editData),
        });

        if (res.ok) {
            setRecords(prev =>
                prev.map(r => (r._id === id ? { ...r, ...editData } : r))
            );
            setEditingId(null);
        } else {
            alert('Failed to update record');
        }
    }


    async function handleAdd() {
        if (!newRecord.domain || !newRecord.ip) {
            alert('Domain and IP are required');
            return;
        }

        const res = await fetch('http://localhost:3001/dns-admin/create-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newRecord),
        });

        if (res.ok) {
            const data = await res.json();

            // assuming backend returns created record
            setRecords(prev => [data.record, ...prev]);
            setNewRecord({ domain: '', ip: '', ttl: 300 });
            setAdding(false);
        } else {
            alert('Failed to add record');
        }
    }


    if (loading) return <div>Loading records...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            {/* Add Record */}
            <div className="mb-4 relative flex  justify-end rounded-lg p-3 ">
                <h2 className=" absolute left-5 text-xl font-semibold mb-4">DNS Records</h2>

                {adding ? (
                    <div className="flex mt-10 gap-2 flex-wrap">
                        <input
                            placeholder="Domain"
                            className="p-2 rounded bg-slate-800 text-white flex-1"
                            value={newRecord.domain}
                            onChange={e =>
                                setNewRecord(prev => ({ ...prev, domain: e.target.value }))
                            }
                        />
                        <input
                            placeholder="IP Address"
                            className="p-2 rounded bg-slate-800 text-white flex-1"
                            value={newRecord.ip}
                            onChange={e =>
                                setNewRecord(prev => ({ ...prev, ip: e.target.value }))
                            }
                        />
                        <input
                            type="number"
                            placeholder="TTL"
                            className="p-2 rounded bg-slate-800 text-white w-24"
                            value={newRecord.ttl}
                            onChange={e =>
                                setNewRecord(prev => ({ ...prev, ttl: Number(e.target.value) }))
                            }
                        />
                        <button
                            onClick={handleAdd}
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
                        + Add DNS Record
                    </button>
                )}
            </div>



            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by domain..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 p-2 rounded bg-slate-800 text-white w-full"
            />

            <ul className="space-y-2 text-slate-300 text-sm">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map(r => (
                        <li
                            key={r._id}
                            className="border-b border-slate-800 pb-2 flex justify-between items-center gap-2"
                        >
                            {editingId === r._id ? (
                                <>
                                    <input
                                        className="p-1 rounded bg-slate-800 text-white w-1/3"
                                        value={editData.domain}
                                        onChange={e =>
                                            setEditData(prev => ({ ...prev, domain: e.target.value }))
                                        }
                                    />
                                    <input
                                        className="p-1 rounded bg-slate-800 text-white w-1/4"
                                        value={editData.ip}
                                        onChange={e =>
                                            setEditData(prev => ({ ...prev, ip: e.target.value }))
                                        }
                                    />
                                    <input
                                        type="number"
                                        className="p-1 rounded bg-slate-800 text-white w-1/6"
                                        value={editData.ttl}
                                        onChange={e =>
                                            setEditData(prev => ({ ...prev, ttl: Number(e.target.value) }))
                                        }
                                    />
                                    <button
                                        onClick={() => saveEdit(r._id)}
                                        className="bg-green-600 px-2 py-1 rounded text-white text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-600 px-2 py-1 rounded text-white text-sm"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="w-1/3">{r.domain}</span>
                                    <span className="w-1/4">{r.ip}</span>
                                    <span className="w-1/6">TTL: {r.ttl}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(r)}
                                            className="bg-blue-600 px-2 py-1 rounded text-white text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r._id)}
                                            className="bg-red-600 px-2 py-1 rounded text-white text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-slate-500">No records found</li>
                )}
            </ul>
        </div>
    );
}
