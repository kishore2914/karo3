import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';
import OnboardingHeader from './OnboardingHeader';

const UserDetailsPage = ({ onNext, onBack, mobileNumber, onLogout }) => {
    const [isMaritalDropdownOpen, setIsMaritalDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        aadhaarNumber: '',
        maritalStatus: '',
        employmentType: 'salaried',
        monthlyIncome: '',
        salaryMode: 'online',
        consent: false,
        incomeConfirm: false,
        kycConsent: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            if (name === 'monthlyIncome') {
                const income = parseFloat(value);
                if (!isNaN(income) && income * 12 > 300000) {
                    newData.incomeConfirm = true;
                }
            }

            return newData;
        });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || token === 'undefined' || token === 'null') {
                alert('Session expired. Please apply again from the home page.');
                window.location.href = '/';
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    aadhaar_number: formData.aadhaarNumber,
                    employment_type: formData.employmentType,
                    monthly_income: formData.monthlyIncome
                })
            });
            if (res.ok) {
                onNext(formData);
            } else {
                console.error("Failed to save profile");
                // Allow proceeding for now to not block flow, or handle error
                onNext(formData);
            }
        } catch (err) {
            console.error(err);
            onNext(formData);
        }
    };

    const isValid = formData.firstName && formData.lastName && formData.email && formData.aadhaarNumber && formData.aadhaarNumber.length === 12 && formData.maritalStatus && formData.monthlyIncome && formData.salaryMode && formData.consent && formData.incomeConfirm && formData.kycConsent;

    return (
        <div className="onboarding-page fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto', background: '#f8fafc' }}>
            <OnboardingHeader mobileNumber={mobileNumber} onLogout={onLogout} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ padding: '40px 40px 24px 40px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', color: '#111827' }}>Tell us about yourself</h2>
                        <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Provide a few basic details</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0', position: 'relative' }}>
                                <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} style={{ padding: '12px', fontSize: '15px' }} />
                                <span style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '11px', color: '#999' }}>As per PAN card</span>
                            </div>

                            <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0', marginTop: '10px', position: 'relative' }}>
                                <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} style={{ padding: '12px', fontSize: '15px' }} />
                                <span style={{ position: 'absolute', bottom: '-20px', left: 0, fontSize: '11px', color: '#999' }}>As per PAN card</span>
                            </div>

                            <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={{ padding: '12px', fontSize: '15px', width: '100%' }} />
                            </div>

                            <div className="input-box-kar" style={{ background: 'white', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                                <input type="text" name="aadhaarNumber" placeholder="Aadhaar Number" maxLength="12" value={formData.aadhaarNumber} onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, aadhaarNumber: val }));
                                }} style={{ padding: '12px', fontSize: '15px', width: '100%' }} />
                            </div>

                            <div style={{ marginTop: '10px', position: 'relative' }}>
                                <div
                                    onClick={() => setIsMaritalDropdownOpen(!isMaritalDropdownOpen)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid #7f8c8d',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        boxShadow: isMaritalDropdownOpen ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>Marital Status</span>
                                        <span style={{ fontSize: '15px', color: formData.maritalStatus ? '#111827' : '#9ca3af', fontWeight: 500 }}>
                                            {formData.maritalStatus || 'Select Option'}
                                        </span>
                                    </div>
                                    <span style={{ transform: isMaritalDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', color: '#666', fontSize: '12px' }}>▼</span>
                                </div>

                                {isMaritalDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        width: '100%',
                                        background: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                        zIndex: 50,
                                        overflow: 'hidden',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {['Married', 'Divorced', 'Separated', 'Single', 'Widowed'].map((status) => (
                                            <div
                                                key={status}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, maritalStatus: status }));
                                                    setIsMaritalDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '14px 16px',
                                                    cursor: 'pointer',
                                                    background: formData.maritalStatus === status ? '#ecfdf5' : 'white',
                                                    fontWeight: formData.maritalStatus === status ? 600 : 400,
                                                    color: '#374151',
                                                    borderBottom: '1px solid #f3f4f6'
                                                }}
                                                onMouseEnter={(e) => { if (formData.maritalStatus !== status) e.currentTarget.style.background = '#f9fafb' }}
                                                onMouseLeave={(e) => { if (formData.maritalStatus !== status) e.currentTarget.style.background = 'white' }}
                                            >
                                                {status}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>Your Employment type</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        {
                                            id: 'salaried',
                                            label: 'Salaried',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                        },
                                        {
                                            id: 'self_employed',
                                            label: 'Self-employed',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v8" /></svg>
                                        }
                                    ].map((type) => (
                                        <label
                                            key={type.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '12px',
                                                    background: formData.employmentType === type.id ? '#d1fae5' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px',
                                                    border: formData.employmentType === type.id ? 'none' : '1px solid #f3f4f6'
                                                }}>
                                                    {type.icon}
                                                </div>
                                                <span style={{
                                                    fontWeight: formData.employmentType === type.id ? 700 : 400,
                                                    fontSize: '15px',
                                                    color: '#1f2937'
                                                }}>
                                                    {type.label}
                                                </span>
                                            </div>
                                            <div style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                border: formData.employmentType === type.id ? '6px solid #064e3b' : '1px solid #9ca3af',
                                                boxSizing: 'border-box'
                                            }}></div>
                                            <input
                                                type="radio"
                                                name="employmentType"
                                                value={type.id}
                                                checked={formData.employmentType === type.id}
                                                onChange={handleChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'white', border: '1px solid #e2e8f0', position: 'relative', marginTop: '10px', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Monthly income</label>
                                <input
                                    type="number"
                                    name="monthlyIncome"
                                    value={formData.monthlyIncome}
                                    onChange={handleChange}
                                    style={{
                                        padding: '0',
                                        fontSize: '24px',
                                        fontWeight: 600,
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none',
                                        color: '#111827'
                                    }}
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'block' }}>How do you get your salary?</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        {
                                            id: 'online',
                                            label: 'Online',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                        },
                                        {
                                            id: 'cheque',
                                            label: 'Cheque',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                        },
                                        {
                                            id: 'cash',
                                            label: 'Cash',
                                            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                                        }
                                    ].map((mode) => (
                                        <label
                                            key={mode.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    background: formData.salaryMode === mode.id ? '#d1fae5' : '#f3f4f6',
                                                    color: formData.salaryMode === mode.id ? '#064e3b' : '#9ca3af',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                    transition: '0.2s'
                                                }}>
                                                    {mode.icon}
                                                </div>
                                                <span style={{
                                                    fontWeight: formData.salaryMode === mode.id ? 700 : 500,
                                                    fontSize: '16px',
                                                    color: '#1f2937'
                                                }}>
                                                    {mode.label}
                                                </span>
                                            </div>
                                            <div style={{
                                                minWidth: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: formData.salaryMode === mode.id ? '6px solid #064e3b' : '2px solid #9ca3af',
                                                boxSizing: 'border-box',
                                                transition: '0.2s'
                                            }}></div>
                                            <input
                                                type="radio"
                                                name="salaryMode"
                                                value={mode.id}
                                                checked={formData.salaryMode === mode.id}
                                                onChange={handleChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                                <label style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}>
                                    <div style={{
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        border: formData.consent ? 'none' : '2px solid #9ca3af',
                                        background: formData.consent ? '#064e3b' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '2px',
                                        transition: '0.2s',
                                        flexShrink: 0
                                    }}>
                                        {formData.consent && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} style={{ display: 'none' }} />
                                    <span style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>I hereby give my consent for Whizdm Finance (P) LTD to access my credit information from CIBIL/ Experian/ Equifax and act as my representative.</span>
                                </label>

                                <label style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}>
                                    <div style={{
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        border: formData.incomeConfirm ? 'none' : '2px solid #9ca3af',
                                        background: formData.incomeConfirm ? '#064e3b' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '2px',
                                        transition: '0.2s',
                                        flexShrink: 0
                                    }}>
                                        {formData.incomeConfirm && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" name="incomeConfirm" checked={formData.incomeConfirm} onChange={handleChange} style={{ display: 'none' }} />
                                    <span style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>I confirm that my household income is above Rs. 3,00,000 per annum</span>
                                </label>

                                <label style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}>
                                    <div style={{
                                        minWidth: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        border: formData.kycConsent ? 'none' : '2px solid #9ca3af',
                                        background: formData.kycConsent ? '#064e3b' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '2px',
                                        transition: '0.2s',
                                        flexShrink: 0
                                    }}>
                                        {formData.kycConsent && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <input type="checkbox" name="kycConsent" checked={formData.kycConsent} onChange={handleChange} style={{ display: 'none' }} />
                                    <span style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>I hereby authorize moneyview's lending partners to download my KYC records from CKYCR.</span>
                                </label>
                            </div>

                            <button
                                className="btn-kar"
                                onClick={isValid ? handleSubmit : null}
                                disabled={!isValid}
                                style={{
                                    width: '100%',
                                    marginTop: '32px',
                                    borderRadius: '12px',
                                    background: isValid ? '#064e3b' : '#e5e7eb',
                                    color: isValid ? 'white' : '#6b7280',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    padding: '16px',
                                    border: 'none',
                                    cursor: isValid ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default UserDetailsPage;
