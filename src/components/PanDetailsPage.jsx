import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';
import OnboardingHeader from './OnboardingHeader';

const PanDetailsPage = ({ onNext, onBack, mobileNumber, onLogout }) => {
    const [formData, setFormData] = useState({
        panNumber: '',
        dob: '',
        pinCode: '',
        gender: '',
        education: '',
        companyName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expired. Please login again.");
                return;
            }

            // Convert DD/MM/YYYY to YYYY-MM-DD
            const [day, month, year] = formData.dob.split('/');
            const formattedDob = `${year}-${month}-${day}`;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pan_number: formData.panNumber,
                    dob: formattedDob, // Ensure valid date format
                    pincode: formData.pinCode,
                    company_name: formData.companyName,
                    // gender and education are currently not stored in backend schema
                })
            });

            if (res.ok) {
                if (onNext) {
                    onNext(formData);
                }
            } else {
                console.error("Failed to save PAN details");
                alert("Failed to save details. Please check your inputs.");
            }
        } catch (err) {
            console.error("Error submitting PAN details:", err);
            alert("Network error. Please try again.");
        }
    };

    return (
        <div className="onboarding-page fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto', background: '#f8fafc' }}>
            <OnboardingHeader mobileNumber={mobileNumber} onLogout={onLogout} />
            <div style={{ margin: '40px auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '32px', color: '#111827' }}>PAN card details</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                        <input type="text" name="panNumber" placeholder="PAN card number" value={formData.panNumber} onChange={handleChange} style={{ padding: '12px', fontSize: '15px', textTransform: 'uppercase' }} maxLength={10} />
                    </div>

                    <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                        <input type="text" name="dob" placeholder="Date of birth (DD/MM/YYYY)" value={formData.dob} onChange={handleChange} style={{ padding: '12px', fontSize: '15px' }} />
                    </div>

                    <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0', position: 'relative' }}>
                        <input type="text" name="pinCode" placeholder="PIN code" value={formData.pinCode} onChange={handleChange} style={{ padding: '12px', fontSize: '15px' }} maxLength={6} />
                        <span style={{ position: 'absolute', bottom: '-24px', left: 0, fontSize: '12px', color: '#666' }}>Current residential address</span>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>Gender</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['Male', 'Female', 'Other'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setFormData(p => ({ ...p, gender: g }))}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '24px',
                                        border: formData.gender === g ? '1px solid #064e3b' : '1px solid #e2e8f0',
                                        background: formData.gender === g ? '#ecfdf5' : 'white',
                                        color: formData.gender === g ? '#064e3b' : '#666',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <select
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', appearance: 'none', background: 'white', fontSize: '15px', color: formData.education ? '#111827' : '#9ca3af' }}
                        >
                            <option value="" disabled>Education</option>
                            <option value="graduate">Graduate</option>
                            <option value="post_graduate">Post Graduate</option>
                            <option value="under_graduate">Under Graduate</option>
                        </select>
                    </div>

                    <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                        <input type="text" name="companyName" placeholder="Company name" value={formData.companyName} onChange={handleChange} style={{ padding: '12px', fontSize: '15px' }} />
                    </div>

                    <button
                        className="btn-kar"
                        style={{ width: '100%', marginTop: '32px', borderRadius: '12px', background: '#064e3b' }}
                        onClick={handleSubmit}
                    >
                        Confirm & proceed
                    </button>

                    <button
                        onClick={onBack}
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanDetailsPage;
