import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/apiConfig';
import '../index.css';
import { validateDocument } from '../utils/imageValidation';

const LoanApplicationFlow = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        mobile: '',
        loanType: '',
        subType: '',
        amount: '',
        tenure: 12,
        details: {}, // Dynamic fields from Step 5
        personal: { fullName: '', relativeName: '', dob: '', gender: '', maritalStatus: '' },
        address: {
            current: { line1: '', line2: '', landmark: '', pincode: '', city: '', state: '' },
            permanent: { line1: '', line2: '', landmark: '', pincode: '', city: '', state: '' },
            isSame: false
        },
        occupation: { type: '', employer: '', income: '' },
        identity: { pan: '', aadhaar: '' },
        bank: { accountHolder: '', accountNumber: '', ifsc: '', bankName: '' },
        documents: { aadhaarFront: null, aadhaarBack: null, panFront: null, panBack: null, bankStatement: null, photo: null },
        declaration: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to update form data
    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // Centralized trigger for "Next" action (called by Enter or Up arrow)
    const triggerMainAction = () => {
        if (!isStepValid()) return;

        // Specific handlers for steps that perform API calls or custom logic
        if (step === 1) handleEmailSubmit();
        else if (step === 2) handleOtpSubmit();
        else if (step === 3) handleMobileSubmit();
        else if (step === 14) handleFinalSubmit();
        else handleNext();
    };

    // Global Keyboard Listener for 'Enter'
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                // Prevent 'Enter' from triggering if user is in a textarea or certain inputs if preferred
                // But for this flow, 'Enter' usually means 'Next'
                triggerMainAction();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, formData]); // Re-bind when step or data changes to ensure we use latest state

    const isStepValid = () => {
        switch (step) {
            case 0: return true;
            case 1: return formData.email && /\S+@\S+\.\S+/.test(formData.email);
            case 2: return formData.otp && formData.otp.length === 6;
            case 3: return formData.mobile && formData.mobile.length === 10;
            case 4: return !!formData.loanType;
            case 5: {
                const amountValid = parseFloat(formData.amount) > 0 && parseFloat(formData.amount) <= 1000000;
                if (formData.loanType === 'Personal Loan') return amountValid && !!formData.subType;
                if (formData.loanType === 'Business Loan') {
                    return amountValid && !!formData.details.businessName && !!formData.details.turnover;
                }
                return amountValid;
            }
            case 6: {
                const docs = formData.documents;
                return docs.aadhaarFront && docs.aadhaarBack && docs.panFront && docs.panBack && docs.bankStatement && docs.photo;
            }
            case 7: {
                const p = formData.personal;
                return p.fullName && p.relativeName && p.dob && p.gender && p.maritalStatus;
            }
            case 8: {
                const c = formData.address.current;
                const currentValid = c.line1 && c.pincode && c.landmark;
                if (formData.address.isSame) return currentValid;
                const p = formData.address.permanent;
                return currentValid && p.line1 && p.pincode && p.landmark;
            }
            case 9: {
                const o = formData.occupation;
                return o.type && o.employer && o.income;
            }
            case 10: return parseFloat(formData.amount) > 0;
            case 11: return formData.identity.pan.length === 10 && formData.identity.aadhaar.length === 12;
            case 12: {
                const b = formData.bank;
                return b.accountHolder && b.bankName && b.accountNumber && b.ifsc;
            }
            case 13: return true; // Preview step is always valid to proceed
            case 14: return formData.declaration;
            default: return true;
        }
    };

    // --- Step 1: Email ---
    const handleEmailSubmit = async () => {
        console.log("🚀 Handling Email Submit...");
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            console.log("❌ Invalid Email");
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        try {
            console.log("📡 Promoting Fetch to import.meta.env.VITE_API_URL}/api/auth/send-otp");
            // API call to send OTP
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, type: 'email' })
            });
            const data = await response.json();
            if (response.ok) {
                console.log("✅ OTP Sent Successfully");
                if (data.debug_otp) {
                    console.log("🤫 DEBUG OTP:", data.debug_otp);
                    alert(`DEBUG: Your OTP is ${data.debug_otp}`);
                }
                handleNext(); // Move to OTP step
            } else {
                console.error("❌ Backend Error:", data.message);
                setError(data.message || "Failed to send OTP.");
                alert("Error from server: " + (data.message || "Failed to send OTP"));
            }
        } catch (err) {
            console.error("❌ Network Fetch Error:", err);
            setError("Network error: " + err.message + ". Check if backend is running.");
            alert("Network Error: Could not connect to backend. Is it running on port 5000?");
        } finally {
            setLoading(false);
        }
    };

    // --- Step 2: OTP ---
    const handleOtpSubmit = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setLoading(true);
        try {
            // API call to verify OTP
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp, type: 'email' })
            });
            const data = await response.json();
            if (response.ok) {
                // Store token/user if needed, but for now just proceed in flow
                localStorage.setItem('token', data.token);
                handleNext(); // Move to Mobile step
            } else {
                setError(data.message || "Invalid OTP.");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Step 3: Mobile ---
    const handleMobileSubmit = () => {
        if (!formData.mobile || formData.mobile.length < 10) {
            setError("Please enter a valid mobile number.");
            return;
        }
        handleNext();
    };

    // --- Step 4: Loan Type Selection ---
    const loanTypes = [
        { id: 'Personal Loan', label: 'Personal Loan' },
        { id: 'Business Loan', label: 'Business Loan' },
        { id: 'Home Loan', label: 'Home Loan' },
        { id: 'Car Loan', label: 'Car Loan' },
        { id: 'Bike Loan', label: 'Bike Loan' },
        { id: 'Medical Loan', label: 'Medical Loan' }
    ];

    const handleTypeSelect = (type) => {
        updateData('loanType', type);
        handleNext();
    };

    // --- Step 5: Dynamic Details ---
    // --- Step 5: Dynamic Details ---
    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();

            // Basic Fields
            data.append('loan_type', formData.loanType);
            data.append('amount', formData.amount || 0);
            data.append('tenure_months', formData.tenure);
            data.append('purpose', formData.subType || formData.loanType);

            // Personal
            data.append('full_name', formData.personal.fullName);
            data.append('relative_name', formData.personal.relativeName);
            data.append('dob', formData.personal.dob);
            data.append('gender', formData.personal.gender);
            data.append('marital_status', formData.personal.maritalStatus);

            // Address
            data.append('current_address', JSON.stringify(formData.address.current));
            data.append('permanent_address', JSON.stringify(formData.address.permanent));
            data.append('is_address_same', formData.address.isSame);

            // Occupation
            data.append('occupation_type', formData.occupation.type);
            data.append('employer_name', formData.occupation.employer);
            data.append('monthly_income', formData.occupation.income);

            // Dynamic Details
            data.append('details', JSON.stringify(formData.details));

            // Identity
            data.append('pan_number', formData.identity.pan);
            data.append('aadhaar_number', formData.identity.aadhaar);

            // Bank Details
            data.append('bank_details', JSON.stringify(formData.bank));

            // Files
            if (formData.documents.aadhaarFront) data.append('aadhaar_front', formData.documents.aadhaarFront);
            if (formData.documents.aadhaarBack) data.append('aadhaar_back', formData.documents.aadhaarBack);
            if (formData.documents.panFront) data.append('pan_front', formData.documents.panFront);
            if (formData.documents.panBack) data.append('pan_back', formData.documents.panBack);
            if (formData.documents.bankStatement) data.append('bank_statement', formData.documents.bankStatement);
            if (formData.documents.photo) data.append('photo', formData.documents.photo);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/loans/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                if (onComplete) onComplete({ ...formData, token, loanId: result.loanId });
            } else {
                const errData = await response.json();
                setError(errData.error || errData.message || "Submission failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Error submitting application.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERERS ---

    const renderStep1_Email = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Let's start with your email.</h2>
            <p className="tf-subtext">We'll send you a verification code.</p>
            <input
                type="email"
                className="tf-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateData('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                autoFocus
            />
            {error && <p className="tf-error">{error}</p>}
            <div className="tf-actions">
                <button className="tf-button" onClick={handleEmailSubmit} disabled={loading || !isStepValid()}>
                    {loading ? 'Sending...' : 'Next →'}
                </button>
            </div>
        </div>
    );

    const renderStep2_Otp = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Check your inbox!</h2>
            <p className="tf-subtext">Enter the 6-digit code sent to {formData.email}.</p>
            <input
                type="text"
                className="tf-input"
                placeholder="123456"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => updateData('otp', e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleOtpSubmit()}
                autoFocus
            />
            {error && <p className="tf-error">{error}</p>}
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleOtpSubmit} disabled={loading || !isStepValid()}>
                    {loading ? 'Verifying...' : 'Verify & Continue →'}
                </button>
            </div>
        </div>
    );

    const renderStep3_Mobile = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">What's your mobile number?</h2>
            <p className="tf-subtext">For important updates about your loan.</p>
            <input
                type="tel"
                className="tf-input"
                placeholder="98765 43210"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => updateData('mobile', e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleMobileSubmit()}
                autoFocus
            />
            {error && <p className="tf-error">{error}</p>}
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleMobileSubmit} disabled={!isStepValid()}>Next →</button>
            </div>
        </div>
    );

    const renderStep4_LoanType = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">What kind of loan are you interested in?</h2>
            <div className="tf-grid">
                {loanTypes.map((type) => (
                    <div key={type.id} className="tf-card" onClick={() => handleTypeSelect(type.id)}>
                        <span className="tf-label">{type.label}</span>
                    </div>
                ))}
            </div>
            <button className="tf-button-sec" onClick={handleBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );

    const renderStep5_Details = () => {
        // Dynamic content based on loanType
        let specificContent = null;

        if (formData.loanType === 'Personal Loan') {
            const options = ['Wedding', 'Travel', 'Education', 'Home Renovation', 'Debt Consolidation', 'Other'];
            specificContent = (
                <div>
                    <p className="tf-label-sm">Purpose of Personal Loan:</p>
                    <div className="tf-tags">
                        {options.map(opt => (
                            <span
                                key={opt}
                                className={`tf-tag ${formData.subType === opt ? 'selected' : ''}`}
                                onClick={() => updateData('subType', opt)}
                            >
                                {opt}
                            </span>
                        ))}
                    </div>
                </div>
            );
        } else if (formData.loanType === 'Business Loan') {
            specificContent = (
                <div>
                    <p className="tf-label-sm">Business Name</p>
                    <input className="tf-input-sm" type="text" placeholder="Enter Business Name"
                        onChange={(e) => updateData('details', { ...formData.details, businessName: e.target.value })} />
                    <p className="tf-label-sm">Annual Turnover</p>
                    <input className="tf-input-sm" type="number" placeholder="₹"
                        onChange={(e) => updateData('details', { ...formData.details, turnover: e.target.value })} />
                </div>
            );
        } else if (formData.loanType === 'Home Loan' || formData.loanType === 'Car Loan' || formData.loanType === 'Bike Loan') {
            specificContent = (
                <div>
                    <p className="tf-label-sm">Estimated Amount Needed</p>
                    <input className="tf-input-sm" type="number" placeholder="₹"
                        min="10000" step="5000"
                        value={formData.amount}
                        onChange={(e) => updateData('amount', e.target.value)} />
                </div>
            );
        } else if (formData.loanType === 'Medical Loan') {
            specificContent = (
                <div>
                    <p className="tf-label-sm">Hospital Name (Optional)</p>
                    <input className="tf-input-sm" type="text" placeholder="Enter Hospital Name"
                        onChange={(e) => updateData('details', { ...formData.details, hospital: e.target.value })} />
                    <p className="tf-label-sm">Estimated Cost</p>
                    <input className="tf-input-sm" type="number" placeholder="₹"
                        min="10000" step="5000"
                        value={formData.amount}
                        onChange={(e) => updateData('amount', e.target.value)} />
                </div>
            );
        }

        return (
            <div className="tf-step fade-in">
                <h2 className="tf-question">Just a few more details for your <span style={{ color: '#064e3b' }}>{formData.loanType}</span>.</h2>

                {/* Common Amount Field if not already handled specific */}
                {['Personal Loan', 'Business Loan'].includes(formData.loanType) && (
                    <div style={{ marginBottom: '20px' }}>
                        <p className="tf-label-sm">How much do you need?</p>
                        <input
                            className="tf-input"
                            type="number"
                            placeholder="₹ Amount"
                            min="10000"
                            max="1000000"
                            step="5000"
                            value={formData.amount}
                            onChange={(e) => updateData('amount', e.target.value)}
                        />
                        <input
                            type="range"
                            min="10000"
                            max="1000000"
                            step="5000"
                            value={formData.amount || 10000}
                            onChange={(e) => updateData('amount', e.target.value)}
                            style={{ width: '100%', marginTop: '10px', accentColor: 'var(--kar-emerald)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
                            <span>₹10,000</span>
                            <span>₹10,00,000</span>
                        </div>
                    </div>
                )}

                {specificContent}

                {error && <p className="tf-error">{error}</p>}
                <div className="tf-actions" style={{ marginTop: '30px' }}>
                    <button className="tf-button-sec" onClick={handleBack}>Back</button>
                    <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>
                        Next →
                    </button>
                </div>
            </div>
        );
    };

    // --- Step 6: Personal Details ---
    const renderStep6_Personal = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Tell us a bit about yourself.</h2>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                <p className="tf-label-sm">Full Name (as per Aadhaar)</p>
                <input className="tf-input-sm" value={formData.personal.fullName}
                    onChange={e => updateData('personal', { ...formData.personal, fullName: e.target.value })} />

                <p className="tf-label-sm">Father's / Mother's / Spouse's Name</p>
                <input className="tf-input-sm" value={formData.personal.relativeName}
                    onChange={e => updateData('personal', { ...formData.personal, relativeName: e.target.value })} />

                <div className="form-row">
                    <div style={{ flex: 1 }}>
                        <p className="tf-label-sm">Date of Birth</p>
                        <input className="tf-input-sm" type="date" value={formData.personal.dob}
                            onChange={e => updateData('personal', { ...formData.personal, dob: e.target.value })} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="tf-label-sm">Gender</p>
                        <select className="tf-input-sm" value={formData.personal.gender}
                            onChange={e => updateData('personal', { ...formData.personal, gender: e.target.value })}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <p className="tf-label-sm">Marital Status</p>
                <div className="tf-tags">
                    {['Single', 'Married', 'Divorced', 'Widowed'].map(s => (
                        <span key={s} className={`tf-tag ${formData.personal.maritalStatus === s ? 'selected' : ''}`}
                            onClick={() => updateData('personal', { ...formData.personal, maritalStatus: s })}>{s}</span>
                    ))}
                </div>
            </div>
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
            </div>
        </div>
    );

    // --- Step 7: Address Details ---
    const renderStep7_Address = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Where do you stay?</h2>
            <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <h4 style={{ marginBottom: '15px' }}>Current Address</h4>
                <input className="tf-input-sm" placeholder="Line 1 (House No, Building)" value={formData.address.current.line1}
                    onChange={e => updateData('address', { ...formData.address, current: { ...formData.address.current, line1: e.target.value } })} />
                <input className="tf-input-sm" placeholder="Line 2 (Street, Area)" value={formData.address.current.line2}
                    onChange={e => updateData('address', { ...formData.address, current: { ...formData.address.current, line2: e.target.value } })} />
                <div className="form-row">
                    <input className="tf-input-sm" placeholder="Pincode" style={{ flex: 1 }} value={formData.address.current.pincode}
                        onChange={e => updateData('address', { ...formData.address, current: { ...formData.address.current, pincode: e.target.value } })} />
                    <input className="tf-input-sm" placeholder="Landmark" style={{ flex: 2 }} value={formData.address.current.landmark}
                        onChange={e => updateData('address', { ...formData.address, current: { ...formData.address.current, landmark: e.target.value } })} />
                </div>

                <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.address.isSame}
                            onChange={e => updateData('address', { ...formData.address, isSame: e.target.checked })}
                            style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Permanent address is same as current</span>
                    </label>
                </div>

                {!formData.address.isSame && (
                    <div className="fade-in">
                        <h4 style={{ marginBottom: '15px' }}>Permanent Address</h4>
                        <input className="tf-input-sm" placeholder="Line 1" value={formData.address.permanent.line1}
                            onChange={e => updateData('address', { ...formData.address, permanent: { ...formData.address.permanent, line1: e.target.value } })} />
                        <input className="tf-input-sm" placeholder="Line 2" value={formData.address.permanent.line2}
                            onChange={e => updateData('address', { ...formData.address, permanent: { ...formData.address.permanent, line2: e.target.value } })} />
                        <div className="form-row">
                            <input className="tf-input-sm" placeholder="Pincode" style={{ flex: 1 }} value={formData.address.permanent.pincode}
                                onChange={e => updateData('address', { ...formData.address, permanent: { ...formData.address.permanent, pincode: e.target.value } })} />
                            <input className="tf-input-sm" placeholder="Landmark" style={{ flex: 2 }} value={formData.address.permanent.landmark}
                                onChange={e => updateData('address', { ...formData.address, permanent: { ...formData.address.permanent, landmark: e.target.value } })} />
                        </div>
                    </div>
                )}
            </div>
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
            </div>
        </div>
    );

    // --- Step 8: Occupation ---
    const renderStep8_Occupation = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">What do you do?</h2>
            <div className="tf-grid occupation-grid" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
                {['Salaried', 'Self-Employed', 'Student', 'Homemaker'].map(type => (
                    <div key={type} className={`tf-card ${formData.occupation.type === type ? 'selected-card' : ''}`}
                        onClick={() => updateData('occupation', { ...formData.occupation, type })}
                        style={{ padding: '20px', borderColor: formData.occupation.type === type ? 'var(--kar-emerald)' : '#e5e7eb' }}>
                        <span className="tf-label">{type}</span>
                    </div>
                ))}
            </div>

            {formData.occupation.type && (
                <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }} className="fade-in">
                    <p className="tf-label-sm">
                        {formData.occupation.type === 'Student' ? 'College / Institute Name' :
                            formData.occupation.type === 'Homemaker' ? 'Primary Earner Name' :
                                'Employer / Business Name'}
                    </p>
                    <input className="tf-input-sm"
                        placeholder={formData.occupation.type === 'Student' ? 'Enter College Name' :
                            formData.occupation.type === 'Homemaker' ? 'Enter Name' :
                                'Enter Name'}
                        value={formData.occupation.employer}
                        onChange={e => updateData('occupation', { ...formData.occupation, employer: e.target.value })} />

                    <p className="tf-label-sm">
                        {formData.occupation.type === 'Student' ? 'Monthly Allowance' :
                            formData.occupation.type === 'Homemaker' ? 'Family Monthly Income' :
                                'Monthly Income'}
                    </p>
                    <input className="tf-input-sm" type="number" placeholder="₹" value={formData.occupation.income}
                        onChange={e => updateData('occupation', { ...formData.occupation, income: e.target.value })} />
                </div>
            )}

            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>

            </div>
        </div>
    );

    // --- Step 9: Loan Configuration ---
    const renderStep9_LoanConfig = () => {
        const p = parseFloat(formData.amount) || 0;
        const r = 12 / 12 / 100; // 12% p.a. fixed for now
        const n = parseFloat(formData.tenure) || 12;

        const emi = p && n ? (p / n) + (p * r) : 0;
        return (
            <div className="tf-step fade-in" style={{ maxWidth: '800px' }}>
                <h2 className="tf-question">Customize your loan.</h2>
                <div style={{ textAlign: 'left', width: '100%', margin: '0 auto' }}>

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label className="tf-label-sm" style={{ fontSize: '18px' }}>Loan Amount</label>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--kar-emerald)' }}>₹ {p.toLocaleString()}</span>
                        </div>
                        <input type="range" min="10000" max="1000000" step="5000" className="tf-range"
                            value={formData.amount || 10000} onChange={e => updateData('amount', e.target.value)} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                            <span>₹10,000</span>
                            <span>₹10,00,000</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label className="tf-label-sm" style={{ fontSize: '18px' }}>Tenure (Months)</label>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--kar-emerald)' }}>{formData.tenure} Months</span>
                        </div>
                        <input type="range" min="3" max="60" step="1" className="tf-range"
                            value={formData.tenure} onChange={e => updateData('tenure', e.target.value)} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                            <span>3 Months</span>
                            <span>60 Months</span>
                        </div>
                    </div>

                    <div className="tf-card" style={{
                        background: '#ecfdf5',
                        border: '2px solid #10b981',
                        textAlign: 'center',
                        padding: '30px',
                        borderRadius: '16px',
                        width: '100%',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
                    }}>
                        <p style={{ margin: 0, fontSize: '18px', color: '#064e3b', fontWeight: 600 }}>Estimated Monthly EMI</p>
                        <h1 style={{ margin: '15px 0', fontSize: '48px', color: '#047857', fontWeight: 900 }}>₹ {Math.round(emi).toLocaleString()}</h1>
                        <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>@ 12% p.a. interest rate</p>
                    </div>

                </div>
                <div className="tf-actions" style={{ marginTop: '40px' }}>
                    <button className="tf-button-sec" onClick={handleBack}>Back</button>
                    <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
                </div>
            </div>
        );
    };

    // --- Step 10: Identity Details ---
    const renderStep10_Identity = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Identity Verification</h2>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                <p className="tf-label-sm">PAN Number</p>
                <input
                    className="tf-input-sm"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={formData.identity.pan}
                    onChange={e => updateData('identity', { ...formData.identity, pan: e.target.value.toUpperCase() })}
                />
                <p className="tf-label-sm">Aadhaar Number</p>
                <input
                    className="tf-input-sm"
                    placeholder="12 digit Aadhaar Number"
                    maxLength={12}
                    value={formData.identity.aadhaar}
                    onChange={e => updateData('identity', { ...formData.identity, aadhaar: e.target.value.replace(/\D/g, '') })}
                />
            </div>
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
            </div>
        </div>
    );

    // --- Step 11: Bank Details ---
    const renderStep11_BankDetails = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Where should we send the money?</h2>
            <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
                <p className="tf-label-sm">Account Holder Name</p>
                <input
                    className="tf-input-sm"
                    placeholder="As per bank records"
                    value={formData.bank.accountHolder}
                    onChange={e => updateData('bank', { ...formData.bank, accountHolder: e.target.value })}
                />
                <p className="tf-label-sm">Bank Name</p>
                <input
                    className="tf-input-sm"
                    placeholder="e.g. HDFC Bank"
                    value={formData.bank.bankName}
                    onChange={e => updateData('bank', { ...formData.bank, bankName: e.target.value })}
                />
                <p className="tf-label-sm">Account Number</p>
                <input
                    className="tf-input-sm"
                    type="password"
                    placeholder="Enter Account Number"
                    value={formData.bank.accountNumber}
                    onChange={e => updateData('bank', { ...formData.bank, accountNumber: e.target.value.replace(/\D/g, '') })}
                />
                <p className="tf-label-sm">IFSC Code</p>
                <input
                    className="tf-input-sm"
                    placeholder="e.g. HDFC0001234"
                    maxLength={11}
                    value={formData.bank.ifsc}
                    onChange={e => updateData('bank', { ...formData.bank, ifsc: e.target.value.toUpperCase() })}
                />
            </div>
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
            </div>
        </div>
    );

    // --- Step 12: Documents ---
    const renderStep12_Documents = () => {
        const handleFileChange = async (field, e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate Document
                try {
                    const { isValid, error } = await validateDocument(file);
                    if (!isValid) {
                        alert(error);
                        e.target.value = null; // Clear input
                        return;
                    }
                    updateData('documents', { ...formData.documents, [field]: file });
                } catch (err) {
                    console.error("Validation error:", err);
                    alert("Could not validate file. Please try another.");
                }
            }
        };

        const FileInput = ({ label, field }) => (
            <div style={{ marginBottom: '20px' }}>
                <p className="tf-label-sm" style={{ marginBottom: '8px' }}>{label}</p>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.documents[field] ? '#f0fdf4' : 'white',
                    borderColor: formData.documents[field] ? '#10b981' : '#d1d5db'
                }}>
                    <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange(field, e)} />
                    <span style={{ flex: 1, color: '#374151', fontSize: '14px' }}>
                        {formData.documents[field] ? formData.documents[field].name : 'Click to upload'}
                    </span>
                </label>
            </div>
        );

        const handleDocumentsNext = () => {
            const { aadhaarFront, aadhaarBack, panFront, panBack, bankStatement, photo } = formData.documents;
            if (!aadhaarFront || !aadhaarBack || !panFront || !panBack || !bankStatement || !photo) {
                alert("Please upload all required documents to proceed.");
                return;
            }
            handleNext();
        };

        return (
            <div className="tf-step fade-in">
                <h2 className="tf-question">Upload Documents</h2>
                <div className="documents-grid" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <FileInput label="Aadhaar Info (Front)" field="aadhaarFront" />
                    <FileInput label="Aadhaar Address (Back)" field="aadhaarBack" />
                    <FileInput label="PAN Card (Front)" field="panFront" />
                    <FileInput label="PAN Card (Back)" field="panBack" />
                    <FileInput label="Bank Statement (3 Months)" field="bankStatement" />
                    <FileInput label="Passport Size Photo" field="photo" />
                </div>
                <div className="tf-actions">
                    <button className="tf-button-sec" onClick={handleBack}>Back</button>
                    <button className="tf-button" onClick={handleNext} disabled={!isStepValid()}>Next →</button>
                </div>
            </div>
        );
    };

    // --- Step 13: Preview ---
    const renderStep13_Preview = () => {
        const Section = ({ title, data, onEdit }) => (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#064e3b', margin: 0 }}>{title}</h3>
                    <button onClick={onEdit} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>Edit</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {Object.entries(data).map(([key, val]) => (
                        <div key={key}>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>{val || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="tf-step fade-in" style={{ maxWidth: '800px', textAlign: 'left' }}>
                <h2 className="tf-question">Review your application.</h2>
                <p className="tf-subtext">Check your details before final submission.</p>

                <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px', marginTop: '30px' }}>
                    <Section
                        title="Loan Details"
                        data={{ Type: formData.loanType, SubType: formData.subType, Amount: `₹${parseFloat(formData.amount).toLocaleString()}`, Tenure: `${formData.tenure} Months` }}
                        onEdit={() => setStep(5)}
                    />
                    <Section
                        title="Personal Information"
                        data={{ Name: formData.personal.fullName, DOB: formData.personal.dob, Gender: formData.personal.gender, MaritalStatus: formData.personal.maritalStatus }}
                        onEdit={() => setStep(7)}
                    />
                    <Section
                        title="Current Address"
                        data={{ Address: `${formData.address.current.line1}, ${formData.address.current.line2}`, Pincode: formData.address.current.pincode, City: formData.address.current.city }}
                        onEdit={() => setStep(8)}
                    />
                    <Section
                        title="Occupation"
                        data={{ Status: formData.occupation.type, Organization: formData.occupation.employer, Income: `₹${parseFloat(formData.occupation.income).toLocaleString()}` }}
                        onEdit={() => setStep(9)}
                    />
                    <Section
                        title="Identity"
                        data={{ PAN: formData.identity.pan, Aadhaar: `XXXX XXXX ${formData.identity.aadhaar.slice(-4)}` }}
                        onEdit={() => setStep(11)}
                    />
                    <Section
                        title="Bank Details"
                        data={{ Holder: formData.bank.accountHolder, Bank: formData.bank.bankName, Account: `XXXX${formData.bank.accountNumber.slice(-4)}`, IFSC: formData.bank.ifsc }}
                        onEdit={() => setStep(12)}
                    />
                </div>

                <div className="tf-actions" style={{ marginTop: '30px' }}>
                    <button className="tf-button-sec" onClick={handleBack}>Back</button>
                    <button className="tf-button" onClick={handleNext}>Proceed to Declaration →</button>
                </div>
            </div>
        );
    };

    // --- Step 14: Declaration ---
    const renderStep14_Declaration = () => (
        <div className="tf-step fade-in">
            <h2 className="tf-question">Final Step!</h2>
            <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Declaration</h4>
                    <ul style={{ fontSize: '14px', color: '#4b5563', paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>I hereby declare that the information provided is true and correct.</li>
                        <li>I authorize Karo Loans to verify my details with credit bureaus.</li>
                        <li>I agree to the Terms and Conditions and Privacy Policy.</li>
                    </ul>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.declaration}
                        onChange={e => updateData('declaration', e.target.checked)}
                        style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>I Agree & Submit Application</span>
                </label>
            </div>
            {error && <p className="tf-error">{error}</p>}
            <div className="tf-actions">
                <button className="tf-button-sec" onClick={handleBack}>Back</button>
                <button className="tf-button" onClick={handleFinalSubmit} disabled={!formData.declaration || loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </div>
    );

    // --- Step 0: Welcome / Instructions ---
    const renderStep0_Welcome = () => (
        <div className="tf-step fade-in" style={{ maxWidth: '800px', textAlign: 'left' }}>
            <div style={{ marginBottom: '30px', color: 'var(--kar-text-muted)', fontSize: '20px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px', color: '#111827' }}>❝</span>
                Credit For Everyone.
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#111827', marginBottom: '30px', fontFamily: 'var(--font-main)' }}>
                Welcome to Karo Loans
            </h1>

            <div style={{ marginBottom: '30px', fontSize: '18px', lineHeight: '1.8', color: '#4b5563' }}>
                <div style={{ marginBottom: '10px' }}><strong>Check eligibility</strong> in seconds with basic details.</div>
                <div style={{ marginBottom: '10px' }}><strong>100% Digital process</strong> - No physical paperwork.</div>
                <div style={{ marginBottom: '10px' }}><strong>Instant Disbursal</strong> directly to your bank account.</div>
                <div>Trusted by thousands of Indians for transparent lending.</div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: '10px' }}>Important:</p>
                <p style={{ color: '#4b5563', marginBottom: '20px', fontSize: '16px' }}>
                    Please ensure you have your <strong>PAN Card</strong> and <strong>Aadhaar Linked Mobile Number</strong> handy for a seamless experience.
                </p>
                <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '15px', color: '#b91c1c', fontSize: '14px' }}>
                    Please fill details carefully. Incorrect information may lead to rejection.
                </div>
            </div>

            <button
                onClick={handleNext}
                style={{
                    background: '#1f2937',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                Continue
            </button>
        </div>
    );

    return (
        <div className="tf-container">
            <div className="tf-header">
                {step > 0 && <button className="tf-button-sec" onClick={handleBack} style={{ padding: '8px 16px', fontSize: '14px' }}>← Back</button>}
                <div className="tf-logo">Karo Loan</div>
                <div style={{ width: '80px' }}></div>
            </div>

            <div className="tf-content">
                {step === 0 && (
                    <div className="tf-step fade-in" style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#064e3b', marginBottom: '20px' }}>Hello! 👋</h1>
                        <h2 className="tf-question">Let's get you that loan.</h2>
                        <p className="tf-subtext">It only takes 5 minutes.</p>
                        <button className="tf-button" onClick={handleNext} style={{ fontSize: '24px', padding: '16px 48px' }}>Start Application</button>
                    </div>
                )}
                {step === 1 && renderStep1_Email()}
                {step === 2 && renderStep2_Otp()}
                {step === 3 && renderStep3_Mobile()}
                {step === 4 && renderStep4_LoanType()}
                {step === 5 && renderStep5_Details()}
                {step === 6 && renderStep6_Personal()}
                {step === 7 && renderStep7_Address()}
                {step === 8 && renderStep8_Occupation()}
                {step === 9 && renderStep9_LoanConfig()}
                {step === 10 && (
                    <div className="tf-step fade-in">
                        <h2 className="tf-question">Almost done!</h2>
                        <p className="tf-subtext">We just need verify your identity.</p>
                        <button className="tf-button" onClick={handleNext}>Continue to KYC →</button>
                    </div>
                )}
                {step === 11 && renderStep10_Identity()} {/* Adjusted Step Index */}
                {step === 12 && renderStep11_BankDetails()}
                {step === 13 && renderStep12_Documents()}
                {step === 14 && (
                    <div className="tf-step fade-in">
                        <h2 className="tf-question">Final Declaration</h2>
                        <label style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer', background: '#f8fafc', padding: '24px', borderRadius: '12px' }}>
                            <input type="checkbox" style={{ width: '24px', height: '24px', flexShrink: 0 }}
                                checked={formData.declaration} onChange={e => updateData('declaration', e.target.checked)} />
                            <span style={{ fontSize: '16px', lineHeight: 1.5 }}>
                                I hereby declare that the information provided is true and correct. I authorize Karo Loan to verify my details and fetch my credit report.
                            </span>
                        </label>
                        <div className="tf-actions">
                            <button className="tf-button" onClick={handleFinalSubmit} disabled={!formData.declaration || loading}>
                                {loading ? 'Submitting...' : 'Submit Application 🚀'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .occupation-grid, .documents-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }
                
                .form-row {
                    display: flex;
                    gap: 20px;
                }

                @media (max-width: 600px) {
                    .occupation-grid, .documents-grid {
                        grid-template-columns: 1fr !important;
                    }
                    
                    .form-row {
                        flex-direction: column;
                        gap: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoanApplicationFlow;
