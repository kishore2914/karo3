import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../config/apiConfig";
import '../index.css';

const AdminDashboard = () => {
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, disbursedAmount: 0 });
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
    const [loanTypeFilter, setLoanTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [staffList, setStaffList] = useState([]);

    const fetchAdminProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAdminProfile(data);

                // Fetch all staff for the dropdown
                const staffRes = await fetch(`${API_BASE_URL}/admin/staff`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (staffRes.ok) {
                    const staffData = await staffRes.json();
                    setStaffList(staffData);
                }
            }
        } catch (err) {
            console.error("Failed to fetch admin profile", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token || role !== 'admin') {
            navigate('/admin/login');
            return;
        }

        fetchLoans();
        fetchStats();
        fetchAdminProfile();
    }, [navigate]);

    const fetchLoans = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/loans`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLoans(data);
            } else {
                console.error("Fetch failed:", res.status);
                if (res.status === 401 || res.status === 403) {
                    alert("Session invalid or access denied. Please login as Admin.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    navigate('/admin/login');
                    return;
                }
                alert(`Failed to load loans: Server returned ${res.status}`);
            }
        } catch (err) {
            console.error('Failed to fetch loans', err);
            alert("Network error: Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else if (res.status === 401 || res.status === 403) {
                // Already handled by fetchLoans, but good to be safe
                navigate('/admin/login');
            }
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    const [callLogs, setCallLogs] = useState([]);
    const [newLog, setNewLog] = useState({
        attended_by: '',
        interest_status: 'neutral',
        notes: '',
        is_reviewed: false
    });

    const [editingLogId, setEditingLogId] = useState(null);

    const fetchCallLogs = async (loanId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/loans/${loanId}/call-logs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCallLogs(data);
            }
        } catch (err) {
            console.error("Failed to fetch call logs", err);
        }
    };

    useEffect(() => {
        if (selectedLoan) {
            fetchCallLogs(selectedLoan.id);
            // Default to current admin, NOT the last attendee (as requested for ownership)
            setNewLog(prev => ({
                ...prev,
                attended_by: staffList.find(s => s.id === adminProfile?.id)?.first_name || adminProfile?.profile?.first_name || 'Admin',
                notes: '',
                interest_status: 'neutral',
                is_reviewed: false
            }));
            setEditingLogId(null);
        }
    }, [selectedLoan, adminProfile, staffList]);

    const handleAddCallLog = async (e) => {
        e.preventDefault();
        try {
            const url = editingLogId
                ? `${API_BASE_URL}/admin/loans/${selectedLoan.id}/call-logs/${editingLogId}`
                : `${API_BASE_URL}/admin/loans/${selectedLoan.id}/call-logs`;

            const res = await fetch(url, {
                method: editingLogId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newLog)
            });
            if (res.ok) {
                fetchCallLogs(selectedLoan.id);
                setNewLog({
                    attended_by: staffList.find(s => s.id === adminProfile?.id)?.first_name || adminProfile?.profile?.first_name || 'Admin',
                    interest_status: 'neutral',
                    notes: '',
                    is_reviewed: false
                });
                setEditingLogId(null);
            } else {
                const errData = await res.json();
                alert(errData.error || 'Operation failed');
            }
        } catch (err) {
            console.error('Operation failed', err);
        }
    };

    const handleEditClick = (log) => {
        setNewLog({
            attended_by: log.attended_by,
            interest_status: log.interest_status,
            notes: log.notes,
            is_reviewed: !!log.is_reviewed
        });
        setEditingLogId(log.id);
    };

    const cancelEdit = () => {
        setEditingLogId(null);
        setNewLog({
            attended_by: staffList.find(s => s.id === adminProfile?.id)?.first_name || adminProfile?.profile?.first_name || 'Admin',
            interest_status: 'neutral',
            notes: '',
            is_reviewed: false
        });
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this loan as ${newStatus}?`)) return;

        try {
            const res = await fetch(`import.meta.env.VITE_API_URL}/api/admin/loans/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchLoans();
                fetchStats();
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/admin/login');
    };

    const filteredLoans = loans.filter(loan => {
        const matchesStatus = filter === 'all' || loan.status === filter;
        const matchesType = loanTypeFilter === 'all' || loan.loan_type === loanTypeFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            (loan.first_name + ' ' + loan.last_name).toLowerCase().includes(searchLower) ||
            loan.phone.includes(searchLower) ||
            loan.email.toLowerCase().includes(searchLower);

        return matchesStatus && matchesType && matchesSearch;
    });

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <header className="dashboard-header" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900, fontSize: '20px', color: '#111827' }}>
                    <div style={{ width: 32, height: 32, background: 'var(--kar-emerald)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>✓</div>
                    Karoloans Admin
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {/* Admin Profile Icon */}
                    <div
                        onClick={() => setShowProfileModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                            padding: '6px 12px', borderRadius: '8px', transition: 'background 0.2s',
                            border: '1px solid #e5e7eb'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', background: 'var(--kar-emerald)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                            {adminProfile?.email ? adminProfile.email[0].toUpperCase() : 'A'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>Signed in as</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                                {adminProfile?.profile?.first_name || adminProfile?.email?.split('@')[0] || 'Admin'}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            {/* Admin Profile Modal */}
            {showProfileModal && adminProfile && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
                }} onClick={() => setShowProfileModal(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: '80px', height: '80px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 16px' }}>
                            {adminProfile.email ? adminProfile.email[0].toUpperCase() : 'A'}
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Admin Profile</h2>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Staff ID: #{adminProfile.id}</div>

                        <div style={{ textAlign: 'left', background: '#f9fafb', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Phone Number</div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{adminProfile.phone}</div>
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</div>
                                <div style={{ fontWeight: 600, color: '#111827' }}>{adminProfile.email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Role</div>
                                <div style={{ fontWeight: 600, color: '#059669', textTransform: 'capitalize' }}>{adminProfile.role}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowProfileModal(false)}
                            style={{ marginTop: '24px', width: '100%', padding: '12px', background: '#111827', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}



            <div className="container" style={{ padding: '40px' }}>
                {/* Stats Cards */}
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    <StatCard title="Total Applications" value={stats.total} icon="📄" />
                    <StatCard title="Pending Review" value={stats.pending} icon="⏳" color="#eab308" />
                    <StatCard title="Approved Loans" value={stats.approved} icon="✅" color="#16a34a" />
                    <StatCard title="Disbursed Amount" value={`₹${(stats.disbursedAmount || 0).toLocaleString()}`} icon="💰" color="#2563eb" />
                </div>

                {/* Filters */}
                {/* Filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    {/* Left Side: Search */}
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '12px 12px 12px 40px',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                outline: 'none',
                                width: '100%',
                                maxWidth: '500px',
                                fontSize: '15px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--kar-emerald)'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Right Side: Loan Type and Status Filters */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={loanTypeFilter}
                            onChange={(e) => setLoanTypeFilter(e.target.value)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                outline: 'none',
                                background: 'white',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Loan Types</option>
                            <option value="Personal Loan">Personal Loan</option>
                            <option value="Business Loan">Business Loan</option>
                            <option value="Home Loan">Home Loan</option>
                            <option value="Vehicle Loan">Vehicle Loan</option>
                            <option value="Medical Loan">Medical Loan</option>
                        </select>
                    </div>

                    {/* Right Side: Status Filters */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['all', 'pending', 'approved', 'rejected', 'disbursed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: filter === f ? '#1f2937' : 'white',
                                    color: filter === f ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textTransform: 'capitalize',
                                    boxShadow: filter === f ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s',
                                    border: filter === f ? 'none' : '1px solid #e5e7eb'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loans Table */}
                <div className="loans-table-container" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Applicant</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Loan Type</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Amount & Tenure</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Purpose</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Income (Monthly)</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No loan applications found.</td>
                                </tr>
                            ) : (
                                filteredLoans.map(loan => (
                                    <tr key={loan.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600, color: '#111827' }}>{loan.first_name} {loan.last_name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{loan.phone}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{loan.email}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600, color: '#4b5563' }}>{loan.loan_type || 'Personal Loan'}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600 }}>₹{parseFloat(loan.amount).toLocaleString()}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{loan.tenure_months} Months</div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#4b5563' }}>{loan.purpose}</td>
                                        <td style={{ padding: '16px', color: '#4b5563' }}>₹{parseFloat(loan.monthly_income || 0).toLocaleString()}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                background: loan.status === 'approved' ? '#dcfce7' : loan.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                                color: loan.status === 'approved' ? '#166534' : loan.status === 'rejected' ? '#991b1b' : '#854d0e'
                                            }}>
                                                {loan.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>
                                            {new Date(loan.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {loan.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan.id, 'approved')}
                                                        style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan.id, 'rejected')}
                                                        style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setSelectedLoan(loan)}
                                                style={{ marginTop: '8px', background: 'transparent', border: '1px solid #e5e7eb', color: '#4b5563', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', width: '100%' }}
                                            >
                                                View Details
                                            </button>
                                            {loan.status === 'approved' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(loan.id, 'disbursed')}
                                                    style={{ marginTop: '8px', background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', width: '100%', fontWeight: 600 }}
                                                >
                                                    💰 Disburse Amount
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {
                selectedLoan && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
                    }}>
                        <div style={{ background: 'white', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Application Details</h2>
                                <button onClick={() => setSelectedLoan(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                            </div>

                            <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase' }}>Applicant Profile</h3>
                                    <DetailRow label="Full Name" value={`${selectedLoan.first_name} ${selectedLoan.last_name}`} />
                                    <DetailRow label="Mobile" value={selectedLoan.phone} />
                                    <DetailRow label="Email" value={selectedLoan.email} />
                                    <DetailRow label="DOB" value={selectedLoan.dob ? new Date(selectedLoan.dob).toLocaleDateString() : 'N/A'} />
                                    <DetailRow label="Aadhaar" value={selectedLoan.aadhaar_number} />
                                    <DetailRow label="PAN" value={selectedLoan.pan_number} />
                                    <DetailRow label="Address" value={`${selectedLoan.address || ''}, ${selectedLoan.pincode || ''}`} />
                                    <DetailRow label="Employment" value={selectedLoan.employment_type} />
                                    <DetailRow label="Company" value={selectedLoan.company_name} />
                                    <DetailRow label="Monthly Income" value={`₹${parseFloat(selectedLoan.monthly_income || 0).toLocaleString()}`} />
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase' }}>Loan Request</h3>
                                    <DetailRow label="Type" value={selectedLoan.loan_type} />
                                    <DetailRow label="Amount" value={`₹${parseFloat(selectedLoan.amount).toLocaleString()}`} />
                                    <DetailRow label="Tenure" value={`${selectedLoan.tenure_months} Months`} />
                                    <DetailRow label="Purpose" value={selectedLoan.purpose} />
                                    <DetailRow label="Applied On" value={new Date(selectedLoan.created_at).toLocaleString()} />
                                    <div style={{ marginTop: '24px' }}>
                                        <span style={{
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            background: selectedLoan.status === 'approved' ? '#dcfce7' : selectedLoan.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                            color: selectedLoan.status === 'approved' ? '#166534' : selectedLoan.status === 'rejected' ? '#991b1b' : '#854d0e',
                                            fontWeight: 800
                                        }}>
                                            Status: {selectedLoan.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Bank Details Section */}
                                    <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase' }}>Bank Details</h3>
                                        {selectedLoan.bank_name ? (
                                            <>
                                                <DetailRow label="Bank Name" value={selectedLoan.bank_name} />
                                                <DetailRow label="Account Number" value={selectedLoan.account_number} />
                                                <DetailRow label="IFSC Code" value={selectedLoan.ifsc} />
                                                <DetailRow label="Account Type" value={selectedLoan.account_type} />
                                            </>
                                        ) : (
                                            <p style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>No bank details provided.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280', marginBottom: '16px', textTransform: 'uppercase' }}>Uploaded Documents</h3>
                                {selectedLoan.documents && selectedLoan.documents.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                        {(() => {
                                            const allowedTypes = ['aadhaar_front', 'aadhaar_back', 'pan_front', 'pan_back', 'bank_statement', 'photo'];

                                            // 1. Deduplicate by type
                                            const uniqueDocs = selectedLoan.documents.reduce((acc, doc) => {
                                                const key = doc.doc_type.trim().toLowerCase();
                                                if (!acc[key]) acc[key] = doc;
                                                return acc;
                                            }, {});

                                            // 2. Filter by whitelist AND map to render
                                            return Object.values(uniqueDocs)
                                                .filter(doc => allowedTypes.includes(doc.doc_type))
                                                .map((doc, i) => (
                                                    <a key={i} href={`import.meta.env.VITE_API_URL${doc.file_url}`} target="_blank" rel="noreferrer" style={{
                                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px',
                                                        border: '1px solid #e5e7eb', borderRadius: '8px', textDecoration: 'none', color: '#111827',
                                                        background: '#f9fafb'
                                                    }}>
                                                        <div style={{ fontSize: '20px' }}>📄</div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>{doc.doc_type.replace(/_/g, ' ')}</div>
                                                            <div style={{ fontSize: '12px', color: '#2563eb' }}>View Document</div>
                                                        </div>
                                                    </a>
                                                ));
                                        })()}
                                    </div>
                                ) : (
                                    <p style={{ color: '#999', fontStyle: 'italic' }}>No documents uploaded.</p>
                                )}
                            </div>

                            <div style={{ marginTop: '32px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', margin: 0 }}>Call History & Notes</h3>
                                    <span style={{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: '12px', fontWeight: 600 }}>
                                        {callLogs.length} Entries
                                    </span>
                                </div>

                                <div className="call-history-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                                    {/* Logs List */}
                                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}>
                                        {callLogs.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📞</div>
                                                <div style={{ fontSize: '14px', color: '#6b7280' }}>No call logs yet.</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {callLogs.map(log => (
                                                    <div key={log.id} style={{
                                                        padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb',
                                                        position: 'relative', borderLeft: `4px solid ${log.interest_status === 'interested' ? '#16a34a' : log.interest_status === 'not_interested' ? '#dc2626' : '#9ca3af'}`
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827', textTransform: 'capitalize' }}>
                                                                {log.interest_status.replace('_', ' ')}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                                {new Date(log.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#4b5563', lineHeight: 1.5 }}>{log.notes}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                                Attended by: <span style={{ fontWeight: 600, color: '#111827' }}>{log.attended_by}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                {log.admin_id === adminProfile?.id && !((selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed')) && (
                                                                    <button
                                                                        onClick={() => handleEditClick(log)}
                                                                        style={{ padding: '2px 8px', fontSize: '11px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: '#4b5563' }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                                {log.is_reviewed ? (
                                                                    <span style={{ fontSize: '11px', color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>REVIEWED</span>
                                                                ) : (
                                                                    <span style={{ fontSize: '11px', color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>PENDING</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* New Entry Form */}
                                    <div style={{ background: editingLogId ? '#fffdeb' : '#f9fafb', padding: '24px', borderRadius: '16px', border: editingLogId ? '1px solid #fef3c7' : '1px solid #e5e7eb', opacity: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? 0.7 : 1, transition: 'all 0.3s ease' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{editingLogId ? 'Edit Call Log' : 'Add New Log'}</h4>
                                            {editingLogId && (
                                                <button onClick={cancelEdit} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                            )}
                                            {(selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') && (
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Locked</span>
                                            )}
                                        </div>

                                        {(selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? (
                                            <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#92400e', display: 'flex', gap: '8px' }}>
                                                <span>🔒</span>
                                                <span>Call logs are locked because this application is already {selectedLoan.status}.</span>
                                            </div>
                                        ) : null}

                                        <form onSubmit={handleAddCallLog}>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Interest Level</label>
                                                <select
                                                    value={newLog.interest_status}
                                                    onChange={e => setNewLog({ ...newLog, interest_status: e.target.value })}
                                                    disabled={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed'}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', background: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? '#f3f4f6' : 'white' }}
                                                >
                                                    <option value="interested">Interested</option>
                                                    <option value="not_interested">Not Interested</option>
                                                    <option value="neutral">Neutral</option>
                                                    <option value="not_reachable">Not Reachable</option>
                                                </select>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Attended By</label>
                                                <select
                                                    value={newLog.attended_by}
                                                    onChange={e => setNewLog({ ...newLog, attended_by: e.target.value })}
                                                    disabled={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed'}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', background: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? '#f3f4f6' : 'white' }}
                                                >
                                                    <option value="">Select Admin</option>
                                                    {staffList.map(staff => (
                                                        <option key={staff.id} value={staff.first_name}>
                                                            {staff.first_name} {staff.last_name || ''} ({staff.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#666', display: 'block', marginBottom: '6px' }}>Notes / Remarks</label>
                                                <textarea
                                                    value={newLog.notes}
                                                    onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                                                    disabled={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed'}
                                                    placeholder={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed' ? "No more remarks allowed." : "Enter call summary..."}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', minHeight: '80px', resize: 'vertical', background: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? '#f3f4f6' : 'white' }}
                                                />
                                            </div>

                                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="checkbox"
                                                    id="is_reviewed"
                                                    checked={newLog.is_reviewed}
                                                    onChange={e => setNewLog({ ...newLog, is_reviewed: e.target.checked })}
                                                    disabled={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed'}
                                                    style={{ width: '16px', height: '16px' }}
                                                />
                                                <label htmlFor="is_reviewed" style={{ fontSize: '13px', fontWeight: 500, color: '#374151', cursor: 'pointer', opacity: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? 0.6 : 1 }}>Mark as Reviewed</label>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed'}
                                                style={{ width: '100%', padding: '12px', background: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? '#9ca3af' : editingLogId ? '#ca8a04' : 'var(--kar-emerald)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: (selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed') ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                                            >
                                                {selectedLoan.status === 'approved' || selectedLoan.status === 'rejected' || selectedLoan.status === 'disbursed' ? 'Logs Locked' : editingLogId ? 'Update Call Log' : 'Save Call Log'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

const DetailRow = ({ label, value }) => (
    <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>{label}</div>
        <div style={{ fontWeight: 600, color: '#111827' }}>{value || '-'}</div>
    </div>
);

const StatCard = ({ title, value, icon, color = '#1f2937' }) => (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>{value}</div>
        </div>
    </div>
);

const DashboardStyles = () => (
    <style>{`
        @media (max-width: 768px) {
            .dashboard-header {
                flex-direction: column;
                gap: 16px;
                padding: 16px 20px !important;
                align-items: flex-start !important;
            }
            
            .stats-grid {
                grid-template-columns: 1fr 1fr !important;
            }

            .loans-table-container {
                overflow-x: auto !important;
            }
            
            .modal-grid {
                grid-template-columns: 1fr !important;
            }
            
            .call-history-grid {
                grid-template-columns: 1fr !important;
            }
        }

        @media (max-width: 480px) {
            .stats-grid {
                grid-template-columns: 1fr !important;
            }
        }
    `}</style>
);

const AdminDashboardWithStyles = () => (
    <>
        <AdminDashboard />
        <DashboardStyles />
    </>
);

export default AdminDashboardWithStyles;
