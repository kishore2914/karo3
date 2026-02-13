import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';

const NachSetup = ({ onComplete, onBack }) => {
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        ifsc: '',
        accountType: 'savings'
    });

    const handleChange = (e) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bank-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bankDetails)
            });

            if (res.ok) {
                onComplete();
            } else {
                alert('Failed to save bank details');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving details');
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', position: 'relative' }}>
            <button
                onClick={onBack}
                style={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: '14px',
                    marginBottom: '10px'
                }}
            >
                ← Back
            </button>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '30px' }}>
                <h2 style={{ marginBottom: '20px', color: '#111827' }}>Set up Auto Debit (NACH)</h2>
                <p style={{ marginBottom: '30px', color: '#6b7280' }}>
                    Enable auto-debit to ensure timely repayments and improve your credit score.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={bankDetails.bankName}
                            onChange={handleChange}
                            placeholder="e.g. HDFC Bank"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter account number"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>IFSC Code</label>
                        <input
                            type="text"
                            name="ifsc"
                            value={bankDetails.ifsc}
                            onChange={handleChange}
                            placeholder="e.g. HDFC0001234"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', textTransform: 'uppercase' }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Account Type</label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="savings"
                                    checked={bankDetails.accountType === 'savings'}
                                    onChange={handleChange}
                                />
                                Savings
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="current"
                                    checked={bankDetails.accountType === 'current'}
                                    onChange={handleChange}
                                />
                                Current
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-kar"
                        style={{ marginTop: '20px' }}
                    >
                        Verify & Enable Auto Debit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NachSetup;
