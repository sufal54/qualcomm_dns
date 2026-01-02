'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DnsRecords from '@/components/DnsRecords';
import SubAdmins from '@/components/SubAdmin';


type StatCardProps = {
  title: string;
  value: string | number;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"
    >
      <p className="text-sm text-slate-400">{title}</p>
      <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
    </motion.div>
  );
}

export default function Home() {
  type DashboardStats = {
    total: { list: number };
    blocked: { list: { _id: boolean; count: number }[] };
    redirects: { list: number };
    ttl: { list: { _id: string | number; count: number }[] };
    recent: { list: any[] };
    topIps: { list: { _id: string; count: number }[] };
  };
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dnsRecords' | "subAdmin">('dashboard');


  const [stats, setStats] = useState<DashboardStats | null>(null);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          total,
          blocked,
          redirects,
          ttl,
          recent,
          topIps,
        ] = await Promise.all([
          fetch('http://localhost:3001/dns-analytics/total', { credentials: 'include' }).then(r => r.json()),
          fetch('http://localhost:3001/dns-analytics/blocked', { credentials: 'include' }).then(r => r.json()),
          fetch('http://localhost:3001/dns-analytics/redirects', { credentials: 'include' }).then(r => r.json()),
          fetch('http://localhost:3001/dns-analytics/ttl', { credentials: 'include' }).then(r => r.json()),
          fetch('http://localhost:3001/dns-analytics/recent', { credentials: 'include' }).then(r => r.json()),
          fetch('http://localhost:3001/dns-analytics/top-ips', { credentials: 'include' }).then(r => r.json()),
        ]);

        setStats({ total, blocked, redirects, ttl, recent, topIps });
        console.log({ total, blocked, redirects, ttl, recent, topIps });

      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6">
        <h1 className="text-xl font-bold mb-8">DNS Admin</h1>
        <nav className="space-y-3 text-slate-300">
          <p
            className={`hover:text-white cursor-pointer ${activeTab === 'dashboard' ? 'text-white font-semibold' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </p>
          <p
            className={`hover:text-white cursor-pointer ${activeTab === 'dnsRecords' ? 'text-white font-semibold' : ''}`}
            onClick={() => setActiveTab('dnsRecords')}
          >
            DNS Records
          </p>
          <p onClick={() => setActiveTab('subAdmin')} className="hover:text-white cursor-pointer">Sub Admins</p>
        </nav>
      </aside>


      {/* Main */}
      <main className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-semibold mb-8"
            >
              Dashboard
            </motion.h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <StatCard title="Total Records" value={stats?.total.list ?? 0} />
              <StatCard title="Redirects" value={stats?.redirects.list ?? 0} />
              <StatCard
                title="Blocked Domains"
                value={stats?.blocked.list.find(i => i._id === true)?.count ?? 0}
              />
            </div>

            {/* Recent Updates */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
              <ul className="space-y-2 text-slate-300 text-sm">
                {stats?.recent.list.length > 0 ? (
                  stats.recent.list.map((item: any, i: number) => (
                    <li key={i} className="border-b border-slate-800 pb-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white">
                          {item.domain ?? 'Unknown domain'}
                        </span>
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {item.ip}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">TTL: {item.ttl}</div>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No recent updates</li>
                )}
              </ul>
            </motion.div>
          </>
        )}

        {activeTab === 'dnsRecords' && <DnsRecords />}
        {activeTab === "subAdmin" && <SubAdmins />}
      </main>

    </div>
  );
}
