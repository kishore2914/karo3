import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';
import '../index.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                if (data.role === 'admin') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    navigate('/admin/dashboard');
                } else {
                    setError('Access denied. Admin privileges required.');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>Admin Login</h2>
                    <p style={{ color: '#666' }}>Secure access for Karoloans Staff</p>
                </div>

                {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter admin phone"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '16px' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-kar" style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '16px' }}>
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
