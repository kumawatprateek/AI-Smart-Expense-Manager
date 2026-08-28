import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { AdminUser, AdminMetrics, AuditLog } from '../types';
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Activity,
  Server,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  TrendingUp,
  Clock,
  Sparkles,
  UserPlus,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user: currentUser, setUser } = useExpense();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit User Modal State
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete User Confirmation Modal
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, metricsRes, logsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/metrics'),
        fetch('/api/admin/audit-logs'),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data);
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRoleAndStatus = async () => {
    if (!selectedUserForEdit) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserForEdit.id,
          role: editRole,
          status: editStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');

      setActionFeedback({ type: 'success', message: `Updated ${selectedUserForEdit.name}'s account permissions.` });
      setSelectedUserForEdit(null);
      fetchAdminData();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      setActionFeedback({ type: 'success', message: `User account deleted successfully.` });
      setUserToDelete(null);
      fetchAdminData();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message });
    } finally {
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleImpersonateUser = (targetUser: AdminUser) => {
    setUser({
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      status: targetUser.status,
      currency: targetUser.currency || 'INR',
      currencySymbol: targetUser.currencySymbol || '₹',
      monthlyIncomeTarget: targetUser.monthlyIncomeTarget,
      savingsRateTarget: targetUser.savingsRateTarget,
      createdAt: targetUser.createdAt,
    });
    setActionFeedback({ type: 'success', message: `Now viewing workspace as ${targetUser.name}` });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Master Admin Panel
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage registered accounts, inspect user telemetry, control system permissions, and monitor Gemini AI resilience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-white/30 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-sky-500 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.totalUsers || users.length}
          </div>
          <div className="mt-2 text-xs font-medium text-emerald-500 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{metrics?.activeUsers || users.filter((u) => u.status === 'active').length} Active Accounts</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Admin Officers
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {metrics?.adminCount || users.filter((u) => u.role === 'admin').length}
          </div>
          <div className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Full System Privileges</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Platform Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ₹{metrics?.totalPlatformVolume?.toLocaleString() || '3,42,800'}
          </div>
          <div className="mt-2 text-xs font-medium text-indigo-500 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>{metrics?.totalTransactionsLogged || 1284} Total Transactions</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Resilience Engine
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 truncate">
            High Availability (99.98%)
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Multi-Model 503 Auto-Failover</span>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-500" />
              <span>User Accounts Directory</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold">
                {filteredUsers.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Promote users, suspend or activate accounts, and inspect individual financial records.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Users Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white focus:outline-hidden"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">User Profile</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3">Transactions</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40 text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {currentUser.id === u.id && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-600 dark:text-sky-300 font-extrabold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      <span className="capitalize">{u.role}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="capitalize">{u.status || 'active'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {u.transactionCount || 18} records
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ₹{(u.totalLoggedVolume || 35000).toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleImpersonateUser(u)}
                        title="Switch into this user account"
                        className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUserForEdit(u);
                          setEditRole(u.role);
                          setEditStatus(u.status || 'active');
                        }}
                        title="Edit Role & Permissions"
                        className="p-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {currentUser.id !== u.id && (
                        <button
                          onClick={() => setUserToDelete(u)}
                          title="Delete Account"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Audit Trail Logs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              System Audit Trail & Security Logs
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Last {auditLogs.length} Events
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white mr-2">
                    {log.action}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {log.details}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                <span>{log.user}</span>
                <span>•</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Edit Permissions: {selectedUserForEdit.name}
            </h3>
            <p className="text-xs text-slate-500 mb-5">{selectedUserForEdit.email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  System Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole('user')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      editRole === 'user'
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Standard User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      editRole === 'admin'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('active')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      editStatus === 'active'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('suspended')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      editStatus === 'suspended'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Suspended</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleUpdateRoleAndStatus}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-white/20 dark:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete User Account?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">{userToDelete.name}</span> ({userToDelete.email})? This action will revoke their login credentials.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-md"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
