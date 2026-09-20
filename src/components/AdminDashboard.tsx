import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LogOut, Lock, RefreshCw, Download } from 'lucide-react';

type TableName =
  | 'survey_responses'
  | 'purchase_interests'
  | 'custom_requests'
  | 'referrals'
  | 'inventory';

const TABLES: { key: TableName; label: string }[] = [
  { key: 'survey_responses', label: 'Survey Responses' },
  { key: 'purchase_interests', label: 'Purchase Interests' },
  { key: 'custom_requests', label: 'Custom Requests' },
  { key: 'referrals', label: 'Referrals' },
  { key: 'inventory', label: 'Inventory' },
];

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME as string | undefined;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const SESSION_KEY = 'admin_authed';

function useAdminAuth() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === 'true');
  }, []);

  const login = (username: string, password: string) => {
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      return { ok: false, error: 'Admin credentials are not configured on this deployment.' };
    }
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid username or password.' };
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  return { authed, login, logout };
}

function LoginForm({ onLogin }: { onLogin: (u: string, p: string) => { ok: boolean; error?: string } }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(username, password);
    if (!result.ok) setError(result.error || 'Login failed.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-slate-200"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Lock className="w-5 h-5 text-slate-700" />
          <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
        </div>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-6 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-lg py-2 font-medium hover:bg-slate-800 transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const s = val === null || val === undefined ? '' : String(val);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

function DataPanel() {
  const [active, setActive] = useState<TableName>('survey_responses');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTable = async (table: TableName) => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTable(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleDownload = () => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${active}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABLES.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              active === t.key
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading...' : `${rows.length} row${rows.length === 1 ? '' : 's'}`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => fetchTable(active)}
            className="flex items-center gap-1 text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleDownload}
            disabled={rows.length === 0}
            className="flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((c) => (
                <th key={c} className="text-left px-4 py-2 font-semibold text-slate-600 whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={c} className="px-4 py-2 whitespace-nowrap max-w-xs truncate">
                    {typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={columns.length || 1} className="px-4 py-6 text-center text-slate-400">
                  No data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { authed, login, logout } = useAdminAuth();

  if (!authed) return <LoginForm onLogin={login} />;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DataPanel />
      </div>
    </div>
  );
}
