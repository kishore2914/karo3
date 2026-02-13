import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/apiConfig';
import OnboardingHeader from './OnboardingHeader';

const LoanDetailsPage = ({ onNext, onBack, loanType = 'Personal Loan', mobileNumber, onLogout }) => {
    // defaults
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(24);
    const [interestRate, setInterestRate] = useState(12); // Default 12%
    const [emi, setEmi] = useState(0);

    // Dynamic fields state
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Set default rates based on loan type
        switch (loanType) {
            case 'Home Loan': setInterestRate(8.5); setAmount(2500000); setTenure(120); break;
            case 'Business Loan': setInterestRate(14); setAmount(1000000); setTenure(36); break;
            case 'Vehicle Loan': setInterestRate(9); setAmount(800000); setTenure(48); break;
            case 'Medical Loan': setInterestRate(11); setAmount(300000); setTenure(12); break;
            default: setInterestRate(12); // Personal
        }
    }, [loanType]);

    useEffect(() => {
        calculateEMI();
    }, [amount, tenure, interestRate]);

    const calculateEMI = () => {
        const r = interestRate / 12 / 100;
        const n = tenure;
        const calcEmi = (amount / n) + (amount * r);
        setEmi(Math.round(calcEmi));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderDynamicFields = () => {
        switch (loanType) {
            case 'Personal Loan':
                return (
                    <>
                        <div className="input-group">
                            <label>Purpose of Loan</label>
                            <select name="purpose" onChange={handleInputChange} className="input-field">
                                <option value="">Select Purpose</option>
                                <option value="wedding">Wedding</option>
                                <option value="travel">Travel</option>
                                <option value="medical">Medical Emergency</option>
                                <option value="home_renovation">Home Renovation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </>
                );
            case 'Business Loan':
                return (
                    <>
                        <div className="input-group">
                            <label>Business Name</label>
                            <input type="text" name="businessName" placeholder="Enter business name" onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="input-group">
                            <label>Years in Business</label>
                            <input type="number" name="vintage" placeholder="e.g. 3" onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="input-group">
                            <label>Annual Turnover (₹)</label>
                            <input type="number" name="turnover" placeholder="e.g. 5000000" onChange={handleInputChange} className="input-field" />
                        </div>
                    </>
                );
            case 'Home Loan':
                return (
                    <>
                        <div className="input-group">
                            <label>Property Location</label>
                            <input type="text" name="location" placeholder="City, Area" onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="input-group">
                            <label>Estimated Property Value (₹)</label>
                            <input type="number" name="propertyValue" placeholder="e.g. 5000000" onChange={handleInputChange} className="input-field" />
                        </div>
                    </>
                );
            case 'Vehicle Loan':
                return (
                    <>
                        <div className="input-group">
                            <label>Vehicle Type</label>
                            <select name="vehicleType" onChange={handleInputChange} className="input-field">
                                <option value="car">Car</option>
                                <option value="bike">Two-Wheeler</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Vehicle Model</label>
                            <input type="text" name="model" placeholder="e.g. Swift Dzire" onChange={handleInputChange} className="input-field" />
                        </div>
                    </>
                );
            case 'Medical Loan':
                return (
                    <>
                        <div className="input-group">
                            <label>Hospital Name</label>
                            <input type="text" name="hospital" placeholder="Enter hospital name" onChange={handleInputChange} className="input-field" />
                        </div>
                        <div className="input-group">
                            <label>Treatment Type</label>
                            <input type="text" name="treatment" placeholder="e.g. Surgery" onChange={handleInputChange} className="input-field" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="onboarding-page fade-in" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <OnboardingHeader mobileNumber={mobileNumber} onLogout={onLogout} />

            <div className="container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#064e3b', marginBottom: '8px' }}>
                        Customize your {loanType}
                    </h2>
                    <p style={{ color: '#64748b', marginBottom: '32px' }}>Adjust amount and tenure to check EMI</p>

                    {/* EMI Calculator Section */}
                    <div style={{ background: '#ecfdf5', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: '#064e3b', fontWeight: 600 }}>Monthly EMI</p>
                                <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#064e3b' }}>₹{emi.toLocaleString()}</h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '14px', color: '#064e3b', fontWeight: 600 }}>Interest Rate</p>
                                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#047857' }}>{interestRate}% p.a.</h3>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontWeight: 600, color: '#374151' }}>Loan Amount</label>
                                <span style={{ fontWeight: 700, color: '#064e3b' }}>₹{amount.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min={loanType === 'Two-Wheeler Loan' ? 10000 : 50000}
                                max={loanType === 'Home Loan' ? 10000000 : 2000000}
                                step={10000}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#064e3b', height: '6px' }}
                            />
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label style={{ fontWeight: 600, color: '#374151' }}>Tenure</label>
                                <span style={{ fontWeight: 700, color: '#064e3b' }}>{tenure} Months</span>
                            </div>
                            <input
                                type="range"
                                min="6"
                                max={loanType === 'Home Loan' ? 360 : 84}
                                step="6"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#064e3b', height: '6px' }}
                            />
                        </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="dynamic-fields" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                        {renderDynamicFields()}
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={onBack}
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Back
                        </button>
                        <button
                            className="btn-kar"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('token');
                                    if (!token || token === 'undefined' || token === 'null') {
                                        alert('Session expired. Please apply again from the home page.');
                                        window.location.href = '/';
                                        return;
                                    }

                                    // Map form data to purpose or other fields as needed
                                    // For Personal Loan, purpose is in formData.purpose
                                    const purpose = formData.purpose || `Loan for ${loanType}`;

                                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/loans/apply`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({
                                            loan_type: loanType,
                                            amount: amount,
                                            tenure_months: tenure,
                                            purpose: purpose
                                        })
                                    });

                                    if (res.ok) {
                                        const data = await res.json();
                                        // Pass loanId up if needed
                                        onNext({ amount, tenure, emi, ...formData, loanId: data.loanId });
                                    } else {
                                        const errorData = await res.json();
                                        alert(`Failed to submit application: ${errorData.error || errorData.message || 'Unknown error'}`);
                                        console.error('Submission failed:', errorData);
                                    }
                                } catch (err) {
                                    console.error(err);
                                    alert(`Network error: ${err.message}`);
                                }
                            }}
                            style={{ flex: 2 }}
                        >
                            Proceed to KYC
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .input-group label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                .input-field {
                    padding: 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 16px;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    border-color: #064e3b;
                    box-shadow: 0 0 0 3px #ecfdf5;
                }
            `}</style>
        </div>
    );
};

export default LoanDetailsPage;
