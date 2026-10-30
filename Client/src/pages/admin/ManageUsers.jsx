import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Shield, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search });
      setUsers(res.data || []);
    } catch (err) {
      addToast('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      addToast(`Updated user role to ${newRole}`, 'success');
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      addToast(err.message || 'Error updating role', 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await adminService.deleteUser(userId);
      addToast('User deleted successfully', 'success');
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      addToast(err.message || 'Error deleting user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
          User Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View registered traveler accounts and assign administrative permissions.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Registered</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    No users found matching "{search}".
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-6 py-3.5 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                          u.role === 'admin'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
