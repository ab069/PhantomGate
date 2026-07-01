import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface HoneyToken {
  id: string;
  name: string;
  token_type: string;
  value: string;
  environment: string;
  is_active: boolean;
  created_at: string;
}

const TOKEN_TYPES = ["aws_key", "db_url", "jwt_secret", "api_key", "github_token"];

export default function Tokens() {
  const token = useAuthStore((s) => s.token)!;
  const [tokens, setTokens] = useState<HoneyToken[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [tokenType, setTokenType] = useState("aws_key");
  const [value, setValue] = useState("");
  const [environment, setEnvironment] = useState("production");

  const fetchTokens = async () => {
    const res = await fetch(`${API}/api/tokens`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTokens(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchTokens();
  }, [token]);

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/api/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, token_type: tokenType, value, environment }),
    });
    setName("");
    setValue("");
    setShowForm(false);
    fetchTokens();
  };

  const deleteToken = async (id: string) => {
    await fetch(`${API}/api/tokens/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTokens();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Honey Tokens</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Token
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createToken}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={tokenType}
                onChange={(e) => setTokenType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                {TOKEN_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Token Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Environment</label>
              <input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Environment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.id} className="border-b border-gray-800 text-sm">
                <td className="px-6 py-4 text-white">{t.name}</td>
                <td className="px-6 py-4 text-gray-400">{t.token_type.replace(/_/g, " ")}</td>
                <td className="px-6 py-4">
                  <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                    {t.environment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      t.is_active
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : "bg-red-900/30 text-red-400 border border-red-800"
                    }`}
                  >
                    {t.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteToken(t.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No tokens deployed yet. Create your first honey token.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
