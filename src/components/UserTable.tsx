'use client';

import React, { useState, useMemo } from 'react';

interface User {
  id: number;
  username: string;
  user_plan: string;
  email_hosting_amount: number;
  web_hosting_amount: number;
  activation_date: string;
  deactivation_date: string;
  plan_for_year: number;
  gstin: string;
  address: string;
  phone_no: string;
  email: string;
  tan_no: string;
  created_at: string;
}




interface UserTableProps {
  users: User[];
  onUpdate: (userId: number, updatedUser: Partial<User>) => void;
  onDelete: (userId: number) => void;
}
type SortKey = keyof User;
type SortOrder = 'asc' | 'desc';

const UserTable: React.FC<UserTableProps> = ({ users, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error'; message: string} | null>(null);

  // Utility functions
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatDateForInput = (dateString: string): string => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  const getStatus = (activationDate: string, deactivationDate: string) => {
    const now = new Date();
    const activation = new Date(activationDate);
    const deactivation = new Date(deactivationDate);
    
    if (now < activation) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (now > deactivation) return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Computed values
  const plans = useMemo(() => [...new Set(users.map(user => user.user_plan))], [users]);

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = [user.username, user.email, user.phone_no, user.user_plan]
        .some(field => field.toLowerCase().includes(searchLower));
      const matchesPlan = !selectedPlan || user.user_plan === selectedPlan;
      return matchesSearch && matchesPlan;
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * modifier;
      }
      return 0;
    });
  }, [users, searchTerm, selectedPlan, sortKey, sortOrder]);

  // Event handlers
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    if (!editingUser || !onUpdate) {
      showNotification('error', 'Cannot save: missing data or update function');
      return;
    }

    // Validation
    const errors = [];
    if (!editingUser.username.trim()) errors.push('Username is required');
    if (!editingUser.email.trim() || !editingUser.email.includes('@')) errors.push('Valid email is required');
    if (!editingUser.phone_no.trim()) errors.push('Phone number is required');
    
    if (errors.length > 0) {
      showNotification('error', errors.join(', '));
      return;
    }

    setLoading(editingUser.id);
    try {
      await onUpdate(editingUser.id, editingUser);
      showNotification('success', `User "${editingUser.username}" updated successfully!`);
      setEditingUser(null);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId || !onDelete) return;
    
    const user = users.find(u => u.id === deleteUserId);
    setLoading(deleteUserId);
    
    try {
      await onDelete(deleteUserId);
      showNotification('success', `User "${user?.username || 'Unknown'}" deleted successfully!`);
      setDeleteUserId(null);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setLoading(null);
    }
  };

  const handleInputChange = (field: keyof User, value: string | number) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [field]: value });
  };

  const renderEditableCell = (user: User, field: keyof User, type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' = 'text') => {
    const isEditing = editingUser?.id === user.id;
    const value = isEditing ? editingUser[field] : user[field];

    if (!isEditing) {
      if (field === 'activation_date' || field === 'deactivation_date' || field === 'created_at') {
        return formatDate(value as string);
      }
      if (field === 'plan_for_year') {
        return `${value} ${value === 1 ? 'year' : 'years'}`;
      }
      if (field === 'user_plan') {
        const colors = { Premium: 'bg-purple-100 text-purple-800', Standard: 'bg-blue-100 text-blue-800' };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[value as keyof typeof colors] || 'bg-green-100 text-green-800'}`}>
            {value}
          </span>
        );
      }
      return value || <span className="text-gray-400">-</span>;
    }

    const commonProps = {
      value: value as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
        handleInputChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
      className: "w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    };

    switch (type) {
      case 'select':
        return (
          <select {...commonProps}>
            {plans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
          </select>
        );
      case 'textarea':
        return <textarea {...commonProps} rows={2} className={`${commonProps.className} resize-none`} />;
      case 'date':
        return <input {...commonProps} type="date" value={formatDateForInput(value as string)} />;
      case 'number':
        return <input {...commonProps} type="number" min={field === 'plan_for_year' ? 1 : 0} />;
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
        <div className="bg-white p-6 rounded-full shadow-lg mb-6">
          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white text-2xl">👥</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
        <p className="text-gray-600 text-center max-w-md">No users in the system yet. Users will appear here once added.</p>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`max-w-md shadow-lg rounded-lg p-4 ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {notification.type === 'success' ? '✓' : '✕'}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className={`mt-1 text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {notification.message}
                </p>
              </div>
              <button onClick={() => setNotification(null)} className={`ml-4 ${notification.type === 'success' ? 'text-green-400 hover:text-green-500' : 'text-red-400 hover:text-red-500'}`}>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
              <p className="text-blue-100">Manage and monitor user accounts ({filteredAndSortedUsers.length} users)</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              
              
              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-800">All Plans</option>
                  {plans.map(plan => <option key={plan} value={plan} className="text-gray-800">{plan}</option>)}
                </select>
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">🏷️</span>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {[
                  { key: 'id', icon: '🆔', label: 'ID' },
                  { key: 'username', icon: '👤', label: 'Username' },
                  { key: 'user_plan', icon: '📋', label: 'Plan' },
                  { key: 'email', icon: '📧', label: 'Email', sortable: false },
                  { key: 'phone_no', icon: '📱', label: 'Phone', sortable: false },
                  { key: 'web_hosting_amount', icon: '💰', label: 'Web Hosting Amount (₹)' },
                  { key: 'gstin', icon: '🏢', label: 'GSTIN', sortable: false },
                  { key: 'tan_no', icon: '📄', label: 'TAN', sortable: false },
                  { key: 'address', icon: '📍', label: 'Address', sortable: false },
                  { key: 'plan_for_year', icon: '⏱️', label: 'Duration' },
                  { key: 'activation_date', icon: '📅', label: 'Activation' },
                  { key: 'deactivation_date', icon: '📅', label: 'Deactivation' },
                  { key: 'created_at', icon: '🕒', label: 'Created' },
                  { key: 'status', icon: '⚡', label: 'Status', sortable: false },
                  { key: 'actions', icon: '⚙️', label: 'Actions', sortable: false }
                ].map(({ key, icon, label, sortable = true }) => (
                  <th key={key} className="px-4 py-3 text-left">
                    {sortable ? (
                      <button
                        onClick={() => handleSort(key as SortKey)}
                        className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        {icon} {label} {sortKey === key ? (sortOrder === 'asc' ? '↑' : '↓') : '↕️'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 font-semibold text-gray-700">
                        {icon} {label}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedUsers.reverse().map((user, index) => {
                const status = getStatus(user.activation_date, user.deactivation_date);
                const isEditing = editingUser?.id === user.id;
                
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${isEditing ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4 font-medium text-gray-900">{user.id}</td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'username')}</td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'user_plan', 'select')}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs truncate" title={user.email}>
                        {renderEditableCell(user, 'email', 'email')}
                      </div>
                    </td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'phone_no', 'tel')}</td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editingUser?.email_hosting_amount || 0}
                            onChange={(e) => handleInputChange('email_hosting_amount', parseFloat(e.target.value) || 0)}
                            placeholder="Email"
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                          <input
                            type="number"
                            value={editingUser?.web_hosting_amount || 0}
                            onChange={(e) => handleInputChange('web_hosting_amount', parseFloat(e.target.value) || 0)}
                            placeholder="Web"
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-green-600">
                          ₹{user.web_hosting_amount}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'gstin')}</td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'tan_no')}</td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs truncate" title={user.address}>
                        {renderEditableCell(user, 'address', 'textarea')}
                      </div>
                    </td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'plan_for_year', 'number')}</td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'activation_date', 'date')}</td>
                    <td className="px-4 py-4">{renderEditableCell(user, 'deactivation_date', 'date')}</td>
                    <td className="px-4 py-4">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={loading === user.id}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs font-medium"
                          >
                            {loading === user.id ? (
                              <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                              </span>
                            ) : '💾 Save'}
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            disabled={loading === user.id}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-xs font-medium"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            disabled={editingUser !== null}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-xs font-medium"
                          >
                            ✏️ Edit
                          </button>
                          {onDelete && (
                            <button
                              onClick={() => setDeleteUserId(user.id)}
                              disabled={editingUser !== null}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-xs font-medium"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Showing {filteredAndSortedUsers.length} of {users.length} users</div>
            <div className="flex items-center gap-4">
              {[
                { color: 'bg-green-500', label: 'Active' },
                { color: 'bg-yellow-500', label: 'Pending' },
                { color: 'bg-red-500', label: 'Expired' }
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${color} rounded-full`}></div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this user? All associated data will be permanently removed.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteUserId(null)}
                disabled={loading === deleteUserId}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading === deleteUserId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading === deleteUserId ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </span>
                ) : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;