// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);

  const load = async () => {
    const { data } = await api.get<AdminUser[]>('/admin/users');
    setUsers(data);
  };

  useEffect(() => { void load(); }, []);

  const suspend = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/suspend`, { reason: 'Suspected scam' });
      toast.success('User suspended');
      await load();
    } catch { toast.error('Failed to suspend'); }
  };

  const unsuspend = async (id: string) => {
    await api.patch(`/admin/users/${id}/unsuspend`);
    toast.success('User reinstated');
    await load();
  };

  return (
    <div className="admin-page">
      <h1 className="cozy-headline">Admin Dashboard</h1>
      <table className="admin-table cozy-card">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isSuspended ? '🔴 Suspended' : '🟢 Active'}</td>
              <td>
                {u.isSuspended
                  ? <button className="cozy-btn" onClick={() => unsuspend(u._id)}>Reinstate</button>
                  : <button className="cozy-btn cozy-btn-outline" onClick={() => suspend(u._id)}>Suspend</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;