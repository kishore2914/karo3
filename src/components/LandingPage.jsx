import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/apiConfig';
import '../index.css';
import TermsConditions from './TermsConditions';
import PrivacyPolicy from './PrivacyPolicy';
import LoanApplicationFlow from './LoanApplicationFlow';

const LandingPage = ({ onApply, onCheckStatus }) => {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'business', 'terms', 'privacy', 'application_flow'
  const [applicationData, setApplicationData] = useState(null); // { type, value }
  const [activeCalculator, setActiveCalculator] = useState(null); // 'Personal Loan', 'Home Loan', etc.
  const [userDetails, setUserDetails] = useState({});

  const [showExpertNumbers, setShowExpertNumbers] = useState(false);

  const handleFlowComplete = (data) => {
    console.log("Application Completed:", data);
    alert("Application Submitted Successfully!");
    setCurrentView('home');
  };

  const handleUserDetailsSubmit = (data) => {
    console.log("User Details:", data);
    setUserDetails(data);
    setCurrentView('pan_details');
  };

  const handleLogout = () => {
    console.log("Logout");
    setApplicationData(null);
    setCurrentView('home');
  };

  const handleApply = (data) => {
    console.log("Apply:", data);
    setApplicationData(data);
    setCurrentView('application_flow');
  };

  // ... (rest of the component)

  return (
    <div className="landing-page">
      {/* ... (Login Modal) ... */}

      {/* NAVIGATION */}
      {!['user_details', 'pan_details', 'terms', 'privacy', 'application_flow'].includes(currentView) && (
        <nav className="nav">
          <div className="container nav-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="logo" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
              <div className="logo-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ fontSize: '28px', fontWeight: 900 }}>Karo</span>
            </div>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
                <button
                  onClick={() => setShowExpertNumbers(!showExpertNumbers)}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#4b5563',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📞</span> Talk to Expert {showExpertNumbers ? '▲' : '▼'}
                </button>

                {showExpertNumbers && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    background: 'white',
                    padding: '24px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                    border: '1px solid #f1f5f9',
                    zIndex: 1000,
                    minWidth: '320px',
                    animation: 'fade-up 0.3s ease-out'
                  }}>
                    {/* Triangle Arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '24px',
                      width: '12px',
                      height: '12px',
                      background: 'white',
                      transform: 'rotate(45deg)',
                      borderLeft: '1px solid #f1f5f9',
                      borderTop: '1px solid #f1f5f9'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '24px' }}>🧑‍💼</span>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#111827' }}>Talk to Expert</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div>
                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>Sales Enquiry</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
                          Call Us: <a href="tel:18005703888" style={{ color: 'var(--kar-emerald)', textDecoration: 'none' }}>1800 570 3888</a>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>Service Helpline</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
                          Call Us: <a href="tel:18002585616" style={{ color: 'var(--kar-emerald)', textDecoration: 'none' }}>1800 258 5616</a>
                        </div>
                      </div>

                      <div style={{ marginTop: '5px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', lineHeight: 1.5 }}>
                          Our advisors are available 7 days a week, <br />
                          <strong style={{ color: '#111827' }}>9:30 am - 6:30 pm</strong> to assist you with the best offers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* DYNAMIC CONTENT */}
      {currentView === 'home' ? (
        <>
          {/* FINAL HERO SECTION - SINGLE VIEWPORT */}
          <header className="hero-final single-viewport">
            <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="hero-grid">
                <div className="hero-text fade-in">
                  <h1 className="hero-title">
                    Instant Credit.<br />
                    <span className="highlight">Zero Friction.</span>
                  </h1>
                  <p className="subtext">
                    Get your dream loan approved in 24 hours with India's most transparent fintech partner.
                  </p>

                  <button className="btn-final" onClick={() => setCurrentView('application_flow')}>
                    Start Application →
                  </button>

                  {/* Compact Features - Integrated into Hero */}
                  <div className="hero-features">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>⚡</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>Lightning Fast</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>24 hours disbursal</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>🛡️</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>100% Secure</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Bank-grade security</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>📄</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>Paperless</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>No physical docs</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hero-visual">
                  <img
                    src="/hero_loan_approved.png.png"
                    alt="Loan Approved 3D Illustration"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/800x600/ffffff/064e3b?text=Loan+Approved+3D+Illustration";
                    }}
                  />
                </div>
              </div>

              {/* Minimal Footer */}
              <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                © 2026 Karo. RBI-registered fintech.
              </div>
            </div>
          </header>
        </>
      ) : currentView === 'application_flow' ? (
        <LoanApplicationFlow onComplete={handleFlowComplete} onBack={() => setCurrentView('home')} />
      ) : currentView === 'user_details' ? (
        <UserDetailsPage onNext={handleUserDetailsSubmit} onBack={() => setCurrentView('home')} mobileNumber={applicationData?.value} onLogout={handleLogout} />
      ) : currentView === 'pan_details' ? (
        <PanDetailsPage onBack={() => setCurrentView('user_details')} mobileNumber={applicationData?.value} onLogout={handleLogout} />
      ) : currentView === 'personal_loan' ? (
        <PersonalLoanPage onApply={handleApply} navigateData={(page) => setCurrentView(page)} />
      ) : (
        null
      )
      }
    </div >
  );
};

// OTP Verification Component
const OTPVerificationPage = ({ onEdit, applicationData, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState(''); // 'sending', 'sent', 'verifying', 'verified', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (applicationData) {
      sendOtp();
    }
  }, [applicationData]);

  const sendOtp = async () => {
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: applicationData?.type === 'mobile' ? applicationData.value : undefined,
          email: applicationData?.type === 'email' ? applicationData.value : undefined,
          type: applicationData?.type || 'mobile'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setStatus('verifying');
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: applicationData?.type === 'mobile' ? applicationData.value : undefined,
          email: applicationData?.type === 'email' ? applicationData.value : undefined,
          type: applicationData?.type || 'mobile',
          otp
        })
      });
      const data = await res.json();
      console.log('OTP Verify Response:', data); // Debugging
      if (res.ok) {
        setStatus('verified');
        // Store Token and User
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Token stored:', data.token);

          setTimeout(() => {
            if (onSuccess) onSuccess(data.user);
          }, 1500);
        } else {
          console.error('Token missing in response');
          setStatus('error');
          setErrorMsg('Authentication failed: No token received.');
        }
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg('Verification failed. Try again.');
    }
  };

  return (
    <div className="otp-page fade-in" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Input */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
        <div style={{ maxWidth: '480px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#111827', marginBottom: '16px', lineHeight: 1.1 }}>
            Verify Identity
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
            One Time Password (OTP) has been sent to your {applicationData?.type} <strong>{applicationData?.value}</strong>.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ border: 'none', outline: 'none', fontSize: '16px', width: '100%', letterSpacing: '4px', fontWeight: 700 }}
              />
              <button onClick={sendOtp} disabled={status === 'sending'} style={{ color: '#059669', fontWeight: 600, fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer' }}>
                {status === 'sending' ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
            {status === 'sent' && <p style={{ color: '#059669', fontSize: '12px', marginTop: '8px' }}>OTP Sent successfully!</p>}
            {errorMsg && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>{errorMsg}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '40px', fontSize: '14px', fontWeight: 700 }}>
            <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '14px', color: '#666' }}>Edit {applicationData?.type}</button>
          </div>

          <button
            className="btn-kar"
            onClick={verifyOtp}
            disabled={status === 'verifying' || status === 'verified'}
            style={{ width: '100%', background: status === 'verified' ? '#059669' : '#064e3b', borderRadius: '8px', opacity: (status === 'verifying') ? 0.7 : 1 }}>
            {status === 'verifying' ? 'Verifying...' : status === 'verified' ? 'Verified & Approved ✅' : 'Verify OTP'}
          </button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div style={{ flex: '1', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img
          src="/personal_loan_hero.png"
          alt="Happy Customer"
          style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
        />
        {status === 'verified' && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontWeight: 800, color: '#064e3b' }}>
            Verified ✅
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable EMI Calculator Component
const EmiCalculator = ({ defaultAmount, maxAmount, defaultTenure, maxTenure, interestRate, themeColor = 'var(--kar-emerald)' }) => {
  const [amount, setAmount] = useState(defaultAmount);
  const [tenure, setTenure] = useState(defaultTenure);

  const calculate = () => {
    const r = interestRate / 12 / 100;
    const emi = (amount / tenure) + (amount * r);
    return Math.round(emi).toLocaleString('en-IN');
  };

  const totalPayment = () => {
    const emiVal = parseInt(calculate().replace(/,/g, ''));
    return (emiVal * tenure).toLocaleString('en-IN');
  };

  const totalInterest = () => {
    const emiVal = parseInt(calculate().replace(/,/g, ''));
    return ((emiVal * tenure) - amount).toLocaleString('en-IN');
  };

  return (
    <div className="emi-calc-grid" style={{ background: `${themeColor}10`, padding: '40px', borderRadius: '30px' }}>
      <div>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontWeight: 700 }}>Loan Amount</label>
            <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, color: themeColor }}>₹ {amount.toLocaleString('en-IN')}</div>
          </div>
          <input type="range" min={maxAmount / 20} max={maxAmount} step={maxAmount / 20} value={amount} onChange={e => setAmount(parseInt(e.target.value))} style={{ width: '100%', accentColor: themeColor }} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontWeight: 700 }}>Tenure (Months)</label>
            <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, color: themeColor }}>{tenure} Months</div>
          </div>
          <input type="range" min="6" max={maxTenure} step="6" value={tenure} onChange={e => setTenure(parseInt(e.target.value))} style={{ width: '100%', accentColor: themeColor }} />
        </div>
        <p style={{ fontSize: '14px', color: '#666' }}>* Interest rate assumed at <strong>{interestRate}%</strong> p.a.</p>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--kar-shadow-sm)' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>Your Monthly EMI</p>
        <h3 style={{ fontSize: '42px', fontWeight: 900, color: themeColor, marginBottom: '8px' }}>₹ {calculate()}</h3>
        <p style={{ fontSize: '13px', color: '#999' }}>for {tenure} months</p>

        <div style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
          <div>Principal<br /><strong>₹ {amount.toLocaleString('en-IN')}</strong></div>
          <div style={{ textAlign: 'right' }}>Interest<br /><strong>₹ {totalInterest()}</strong></div>
        </div>

        <button className="btn-kar" style={{ width: '100%', marginTop: '24px', background: themeColor }}>Apply Now</button>
      </div>
    </div>
  );
};

// Extracted Component: Personal Loan
const PersonalLoanPage = ({ onApply, navigateData }) => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(true);
  const [contactMethod, setContactMethod] = useState('mobile'); // 'mobile' or 'email'
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="personal-loan-page fade-in">
      {/* Personal Hero */}
      <section className="hero-kar personal-hero" style={{ background: '#ffffff', color: '#111827' }}>
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#111827' }}>
              <div style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', display: 'inline-block', paddingBottom: '4px', color: '#064e3b', borderBottom: '2px solid #064e3b' }}>Personal Loan</div>
              <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#064e3b', lineHeight: 1.1, marginBottom: '24px' }}>Personal Loans for<br />Every Dream.</h1>
              <p className="subtext" style={{ color: '#4b5563', fontSize: '20px', marginBottom: '40px' }}>Get up to <span style={{ color: '#064e3b', fontWeight: 800 }}>₹10 Lakhs</span> in your account in 24 hours.</p>

              <div style={{ display: 'flex', gap: '24px', margin: '32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>⚡</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>Disbursal in<br /><strong style={{ color: '#111827' }}>24 Hours*</strong></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>📱</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>100% Digital<br /><strong style={{ color: '#111827' }}>Process</strong></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>🔒</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>No Collateral<br /><strong style={{ color: '#111827' }}>Required</strong></div>
                </div>
              </div>

              <div className="input-group-kar" style={{ background: 'transparent', gap: '16px', flexDirection: 'column', height: 'auto' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button onClick={() => setContactMethod('mobile')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'mobile' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'mobile' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Mobile Number</button>
                  <button onClick={() => setContactMethod('email')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'email' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'email' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Email ID</button>
                </div>
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  {contactMethod === 'mobile' && (
                    <div className="input-box-kar" style={{ flex: '0.3', background: '#f3f4f6', border: 'none' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>🇮🇳 +91</span>
                    </div>
                  )}
                  <div className="input-box-kar" style={{ flex: contactMethod === 'mobile' ? '0.7' : '1', background: '#f3f4f6', border: 'none' }}>
                    <input
                      type={contactMethod === 'mobile' ? 'text' : 'email'}
                      placeholder={contactMethod === 'mobile' ? 'Enter mobile number' : 'Enter email address'}
                      value={inputValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (contactMethod === 'mobile') {
                          // Only allow numbers and max 10 digits
                          if (/^\d{0,10}$/.test(val)) {
                            setInputValue(val);
                          }
                        } else {
                          setInputValue(val);
                        }
                      }}
                      style={{
                        color: '#111827',
                        background: 'transparent',
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-kar"
                disabled={!isTermsChecked}
                onClick={() => onApply({ type: contactMethod, value: inputValue })}
                style={{
                  borderRadius: '12px',
                  background: isTermsChecked ? '#6ee7b7' : '#d1fae5',
                  color: isTermsChecked ? '#064e3b' : '#9ca3af',
                  fontWeight: 800,
                  boxShadow: isTermsChecked ? '0 10px 20px -5px rgba(16, 185, 129, 0.4)' : 'none',
                  cursor: isTermsChecked ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  marginTop: '0'
                }}
              >
                Apply Now
              </button>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  <span>By proceeding, you agree with our <a href="#" onClick={(e) => { e.preventDefault(); navigateData('terms'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</a> & <a href="#" onClick={(e) => { e.preventDefault(); navigateData('privacy'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</a></span>
                </label>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isWhatsappChecked}
                    onChange={(e) => setIsWhatsappChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  I agree to receive updates on Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/personal_loan_hero.png"
              alt="Personal Loan"
              style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x600/png?text=Personal+Loan";
              }}
            />
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px', textAlign: 'center' }}>Personal Loan EMI Calculator</h2>
        <EmiCalculator defaultAmount={200000} maxAmount={1000000} defaultTenure={24} maxTenure={60} interestRate={10.5} themeColor="#059669" />
      </section>

      {/* 4 Steps Process */}
      <section className="container" style={{ padding: '40px 0' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, textAlign: 'center', marginBottom: '60px' }}>Apply for a Personal Loan in 4 Steps</h2>
        <div className="steps-grid">
          <div style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: -1 }}></div>
          {[
            { step: 'Step 1', title: 'Check Eligibility', desc: 'Enter number to check offer' },
            { step: 'Step 2', title: 'KYC & Income', desc: 'Quick online verification' },
            { step: 'Step 3', title: 'Start e-Mandate', desc: 'Setup auto-repayment' },
            { step: 'Step 4', title: 'Disbursal', desc: 'Money in account instantly' }
          ].map((s, i) => (
            <div key={i} style={{ width: '220px', textAlign: 'center', background: 'white', padding: '0 10px' }}>
              <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {i === 0 ? '📝' : i === 1 ? '🤳' : i === 2 ? '🏦' : '💰'}
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{s.step}</h4>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{s.title}</p>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Simple Documentation</h2>
          <div className="docs-grid">
            {[
              { title: 'Identity Proof', icon: '🆔' },
              { title: 'Last 3 Months Payslip', icon: '📄' },
              { title: 'Bank Statement', icon: '🏦' },
              { title: 'Address Proof', icon: '🏠' }
            ].map((doc, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--kar-shadow-sm)' }}>
                <div style={{ fontSize: '32px', background: '#f3f4f6', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{doc.icon}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hero-title {
          font-size: 72px;
          font-weight: 950;
          line-height: 0.95;
          letter-spacing: -3.5px;
          color: #0f172a;
          margin-bottom: 24px;
        }
        
        .hero-features {
          margin-top: 48px;
          display: flex;
          gap: 32px;
          padding-top: 32px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .emi-calc-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
        }

        .steps-grid {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .docs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
            letter-spacing: -1.5px;
          }

          .hero-features {
            flex-direction: column;
            gap: 20px;
          }

          .emi-calc-grid {
            grid-template-columns: 1fr;
            padding: 24px !important;
          }

          .steps-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
          }
           
          /* Hide the horizontal line on mobile */
          .steps-grid > div:first-child { 
             display: none;
          }

          .docs-grid {
            grid-template-columns: 1fr;
          }
          
          .steps-grid > div {
             width: 100% !important;
          }
        }
      `}</style>

      {/* Documents */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Simple Documentation</h2>
          <div className="docs-grid">
            {[
              { title: 'Identity Proof', icon: '🆔' },
              { title: 'Last 3 Months Payslip', icon: '📄' },
              { title: 'Bank Statement', icon: '🏦' },
              { title: 'Address Proof', icon: '🏠' }
            ].map((doc, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--kar-shadow-sm)' }}>
                <div style={{ fontSize: '32px', background: '#f3f4f6', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{doc.icon}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div >
  );
};

// Extracted Component
const BusinessLoanPage = ({ onApply, navigateData }) => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(true);
  const [contactMethod, setContactMethod] = useState('mobile');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="business-page fade-in">
      {/* Business Hero */}
      <section className="hero-kar business-hero">
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar">
              <h1 style={{ fontSize: '48px' }}>Business loan<br />that's made for<br />you</h1>
              <p className="subtext">Get up to ₹5 lakhs instantly!</p>

              <div className="input-group-kar" style={{ flexDirection: 'column', height: 'auto', padding: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button onClick={() => setContactMethod('mobile')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'mobile' ? '2px solid var(--kar-emerald)' : 'none', fontWeight: 700, color: contactMethod === 'mobile' ? 'var(--kar-emerald)' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Mobile Number</button>
                  <button onClick={() => setContactMethod('email')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'email' ? '2px solid var(--kar-emerald)' : 'none', fontWeight: 700, color: contactMethod === 'email' ? 'var(--kar-emerald)' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Email ID</button>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  {contactMethod === 'mobile' && (
                    <div className="input-box-kar" style={{ flex: '0.3' }}>
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                  )}
                  <div className="input-box-kar" style={{ flex: contactMethod === 'mobile' ? '0.7' : '1' }}>
                    <input
                      type={contactMethod === 'mobile' ? 'text' : 'email'}
                      placeholder={contactMethod === 'mobile' ? 'Enter mobile number' : 'Enter email address'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-kar"
                disabled={!isTermsChecked}
                onClick={() => onApply({ type: contactMethod, value: inputValue })}
                style={{
                  borderRadius: '8px',
                  background: isTermsChecked ? 'var(--kar-emerald)' : '#a7f3d0',
                  cursor: isTermsChecked ? 'pointer' : 'not-allowed'
                }}
              >
                Apply Now
              </button>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    style={{ accentColor: 'var(--kar-emerald)', width: 16, height: 16 }}
                  />
                  <span>By proceeding, you agree with our <a href="#" onClick={(e) => { e.preventDefault(); navigateData('terms'); }} style={{ color: 'var(--kar-emerald)', fontWeight: 700 }}>Terms & Conditions</a> & <a href="#" onClick={(e) => { e.preventDefault(); navigateData('privacy'); }} style={{ color: 'var(--kar-emerald)', fontWeight: 700 }}>Privacy Policy</a></span>
                </label>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isWhatsappChecked}
                    onChange={(e) => setIsWhatsappChecked(e.target.checked)}
                    style={{ accentColor: 'var(--kar-emerald)', width: 16, height: 16 }}
                  />
                  I agree to receive updates on Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar">
            <img src="/business_loan_hero_indian_man.png" alt="Business Growth" style={{ maxHeight: '600px', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px' }}>Why choose us?</h2>
        <div className="bento-grid responsive-bento" style={{ marginTop: '0' }}>
          <div className="bento-item" style={{ background: '#f8fafc', border: 'none' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Affordable credit at every step</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Monthly interest starts from 1.33%*</p>
            <div style={{ fontSize: '48px', textAlign: 'right', color: '#f87171' }}>%</div>
          </div>
          <div className="bento-item" style={{ background: '#f8fafc', border: 'none' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Hassle-free application process</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Apply online from anywhere & enjoy quick approval</p>
            <div style={{ fontSize: '48px', textAlign: 'right', color: 'var(--kar-emerald)' }}>📱</div>
          </div>
          <div className="bento-item" style={{ background: '#f8fafc', border: 'none' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Flexible repayment plans</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Get up to 60 months to repay your loan</p>
            <div style={{ fontSize: '48px', textAlign: 'right', color: '#a78bfa' }}>📅</div>
          </div>
          <div className="bento-item" style={{ background: '#f8fafc', border: 'none' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Zero collateral</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>100% transparent, no collateral loan made for you</p>
            <div style={{ fontSize: '48px', textAlign: 'right', color: '#3b82f6' }}>0</div>
          </div>
        </div>
      </section>

      {/* Business EMI Calculator - ADDED */}
      <section className="container" style={{ padding: '40px 0 80px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px', textAlign: 'center' }}>Business Loan EMI Calculator</h2>
        <EmiCalculator defaultAmount={1000000} maxAmount={5000000} defaultTenure={36} maxTenure={60} interestRate={12.5} themeColor="#ea580c" />
      </section>

      {/* Application Process */}
      <section className="container" style={{ padding: '0 0 80px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px' }}>Apply for a business loan</h2>
        <div className="responsive-grid-4">
          {[
            { title: 'Check eligibility', desc: 'By providing basic details', icon: '👤' },
            { title: 'Select offer', desc: 'Choose the amount you need & a flexible repayment plan', icon: '🏷️' },
            { title: 'Document verification', desc: 'Upload all the required documents & get approved', icon: '📄' },
            { title: 'Instant disbursal', desc: 'Get the money in your bank account', icon: '💸' }
          ].map((step, idx) => (
            <div key={idx} style={{ padding: '32px', background: 'white', borderRadius: '20px', boxShadow: 'var(--kar-shadow-sm)', border: '1px solid #f0f0f0', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.5 }}>{step.desc}</p>
              <div style={{ fontSize: '40px' }}>{step.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents Required - ADDED */}
      <section style={{ background: '#fff7ed', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Documents needed for Business Loan</h2>
          <div className="responsive-grid-4">
            {[
              { title: 'Business Proof', icon: '🏢' },
              { title: 'GST Returns', icon: '📊' },
              { title: 'Bank Statements', icon: '🏦' },
              { title: 'KYC of Directors', icon: '🆔' }
            ].map((doc, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--kar-shadow-sm)' }}>
                <div style={{ fontSize: '32px', background: '#ffedd5', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{doc.icon}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Banner */}
      <section style={{ background: '#ea580c', padding: '80px 0', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px' }}>Trusted by millions</h2>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px' }}>We're present across the nook & corner of the country, making loans accessible, and simple!</p>

            <div style={{ display: 'flex', gap: '60px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>60 Million+</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Happy Users</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>12,000 Cr+</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Loan Disbursed</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 800 }}>19,000+</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Locations Served</div>
              </div>
            </div>
          </div>
          <img src="/hero-man.png" alt="Happy Customers" style={{ height: '400px', objectFit: 'contain' }} className="trusted-img" />
        </div>
      </section>

      <style>{`
        .responsive-bento {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 24px;
        }

        .responsive-grid-4 {
           display: grid;
           grid-template-columns: repeat(4, 1fr);
           gap: 24px;
        }

        @media (max-width: 768px) {
           .responsive-bento {
              grid-template-columns: 1fr !important;
           }
           
           .responsive-grid-4 {
              grid-template-columns: 1fr !important;
           }
           
           .hero-layout-kar {
              flex-direction: column;
           }
           
           .hero-card-kar h1 {
              font-size: 36px !important;
           }
           
           .hero-visual-kar {
              display: none !important;
           }

           .trusted-img {
              display: none;
           }
        }
      `}</style>
    </div>
  );
};

// Extracted Component: Home Loan
const HomeLoanPage = ({ onApply, navigateData }) => {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [tenure, setTenure] = useState(15);
  const [interest, setInterest] = useState(7.75);

  const calculateEMI = (p, t, r) => {
    const monthlyRate = r / 12 / 100;
    const months = t * 12;
    const emi = (p / months) + (p * monthlyRate);
    return Math.round(emi).toLocaleString('en-IN');
  };

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(true);
  const [contactMethod, setContactMethod] = useState('mobile');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="home-loan-page fade-in">
      {/* Home Loan Hero */}
      <section className="hero-kar home-hero" style={{ background: '#ffffff', color: '#111827' }}>
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#111827' }}>
              <div style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', display: 'inline-block', paddingBottom: '4px', color: '#064e3b', borderBottom: '2px solid #064e3b' }}>Home Loan</div>
              <h1 style={{ fontSize: '56px', color: '#064e3b', lineHeight: 1.1, marginBottom: '24px' }}>Enjoy Lowest Rates<br />on Home Loans!</h1>
              <p className="subtext" style={{ color: '#4b5563', fontSize: '20px', marginBottom: '40px' }}>Starting from <span style={{ color: '#064e3b', fontWeight: 800 }}>7.75% p.a.</span></p>

              <div style={{ display: 'flex', gap: '24px', margin: '32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>🕒</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>Get approval in<br /><strong style={{ color: '#111827' }}>24 hours*</strong></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>📅</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>Repayment<br /><strong style={{ color: '#111827' }}>up to 30 years*</strong></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px', color: '#064e3b' }}>📄</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.2, color: '#4b5563' }}>Zero Prepayment<br /><strong style={{ color: '#111827' }}>charges</strong></div>
                </div>
              </div>

              <div className="input-group-kar" style={{ background: 'transparent', gap: '16px', flexDirection: 'column', height: 'auto' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button onClick={() => setContactMethod('mobile')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'mobile' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'mobile' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Mobile Number</button>
                  <button onClick={() => setContactMethod('email')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'email' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'email' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Email ID</button>
                </div>
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  {contactMethod === 'mobile' && (
                    <div className="input-box-kar" style={{ flex: '0.3', background: '#f3f4f6', border: 'none' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>🇮🇳 +91</span>
                    </div>
                  )}
                  <div className="input-box-kar" style={{ flex: contactMethod === 'mobile' ? '0.7' : '1', background: '#f3f4f6', border: 'none' }}>
                    <input
                      type={contactMethod === 'mobile' ? 'text' : 'email'}
                      placeholder={contactMethod === 'mobile' ? 'Enter mobile number' : 'Enter email address'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      style={{ color: '#111827', background: 'transparent' }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-kar"
                disabled={!isTermsChecked}
                onClick={() => onApply({ type: contactMethod, value: inputValue })}
                style={{
                  borderRadius: '12px',
                  background: isTermsChecked ? '#6ee7b7' : '#d1fae5',
                  color: isTermsChecked ? '#064e3b' : '#9ca3af',
                  fontWeight: 800,
                  boxShadow: isTermsChecked ? '0 10px 20px -5px rgba(16, 185, 129, 0.4)' : 'none',
                  cursor: isTermsChecked ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  marginTop: '0'
                }}
              >
                Apply Now
              </button>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  <span>By proceeding, you agree with our <a href="#" onClick={(e) => { e.preventDefault(); navigateData('terms'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</a> & <a href="#" onClick={(e) => { e.preventDefault(); navigateData('privacy'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</a></span>
                </label>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isWhatsappChecked}
                    onChange={(e) => setIsWhatsappChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  I agree to receive updates on Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/home_loan_hero.png"
              alt="Happy Family"
              style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x600/png?text=Happy+Family";
              }}
            />
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px', textAlign: 'center' }}>Karoloans Home Loan EMI Calculator</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', background: '#ecfdf5', padding: '40px', borderRadius: '30px' }}>
          <div>
            {/* Sliders */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontWeight: 700 }}>Loan Amount</label>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800 }}>₹ {loanAmount.toLocaleString('en-IN')}</div>
              </div>
              <input type="range" min="500000" max="10000000" step="100000" value={loanAmount} onChange={e => setLoanAmount(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--kar-emerald)' }} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontWeight: 700 }}>Rate of Interest (%)</label>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800 }}>{interest}%</div>
              </div>
              <input type="range" min="7" max="15" step="0.1" value={interest} onChange={e => setInterest(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--kar-emerald)' }} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontWeight: 700 }}>Loan Tenure (Years)</label>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800 }}>{tenure} Years</div>
              </div>
              <input type="range" min="1" max="30" step="1" value={tenure} onChange={e => setTenure(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--kar-emerald)' }} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--kar-shadow-sm)' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>Your Monthly EMI</p>
            <h3 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--kar-emerald)', marginBottom: '8px' }}>₹ {calculateEMI(loanAmount, tenure, interest)}</h3>
            <p style={{ fontSize: '13px', color: '#999' }}>for {tenure} years</p>

            <div style={{ width: '100%', marginTop: '32px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
              <div>Principal<br /><strong>₹ {loanAmount.toLocaleString('en-IN')}</strong></div>
              <div style={{ textAlign: 'right' }}>Interest<br /><strong>₹ {Math.round((parseInt(calculateEMI(loanAmount, tenure, interest).replace(/,/g, '')) * tenure * 12) - loanAmount).toLocaleString('en-IN')}</strong></div>
            </div>

            <button className="btn-kar" style={{ width: '100%', marginTop: '24px' }}>Apply Now</button>
          </div>
        </div>
      </section>

      {/* 4 Steps Process */}
      <section className="container" style={{ padding: '40px 0' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, textAlign: 'center', marginBottom: '60px' }}>Apply for a Home Loan in 4 Steps</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '40px', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: -1 }}></div>
          {[
            { step: 'Step 1', title: 'Check Eligibility', desc: 'Enter basic details to check offer' },
            { step: 'Step 2', title: 'Verification', desc: 'Lending partner calls to confirm' },
            { step: 'Step 3', title: 'Property Check', desc: 'Site visit & legal verification' },
            { step: 'Step 4', title: 'Approval', desc: 'Loan sanctioned & disbursed' }
          ].map((s, i) => (
            <div key={i} style={{ width: '220px', textAlign: 'center', background: 'white', padding: '0 10px' }}>
              <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {i === 0 ? '📝' : i === 1 ? '📞' : i === 2 ? '🏠' : '✅'}
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{s.step}</h4>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>{s.title}</p>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Documents Required */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>List of documents needed</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: 'Proof of Income', icon: '📄' },
              { title: 'Bank Statement', icon: '🏦' },
              { title: 'Proof of Residence', icon: '🏠' },
              { title: 'Property Documents', icon: '📑' },
              { title: 'Latest Form 16', icon: '📋' }
            ].map((doc, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--kar-shadow-sm)' }}>
                <div style={{ fontSize: '32px', background: '#f3f4f6', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{doc.icon}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Extracted Component: Vehicle Loan
const VehicleLoanPage = ({ onApply, navigateData }) => {
  const [vehicleType, setVehicleType] = useState('car'); // 'car' or 'bike'
  const [loanAmount, setLoanAmount] = useState(vehicleType === 'car' ? 800000 : 100000);
  const [tenure, setTenure] = useState(vehicleType === 'car' ? 48 : 24);

  // Rate defaults: Car ~8.5%, Bike ~10.5%
  const interest = vehicleType === 'car' ? 8.5 : 10.5;

  const calculateEMI = (p, t, r) => {
    const monthlyRate = r / 12 / 100;
    const months = t; // Tenure is in months for vehicle
    const emi = (p / months) + (p * monthlyRate);
    return Math.round(emi).toLocaleString('en-IN');
  };

  // Adjust defaults when switching
  const handleTypeSwitch = (type) => {
    setVehicleType(type);
    if (type === 'car') {
      setLoanAmount(800000);
      setTenure(48);
    } else {
      setLoanAmount(100000);
      setTenure(24);
    }
  };

  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(true);
  const [contactMethod, setContactMethod] = useState('mobile');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="vehicle-loan-page fade-in">
      {/* Vehicle Hero */}
      <section className="hero-kar vehicle-hero" style={{ background: '#ffffff', color: '#111827' }}>
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#111827' }}>

              {/* Toggle Switch */}
              <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '30px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
                <button
                  onClick={() => handleTypeSwitch('car')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: vehicleType === 'car' ? 'white' : 'transparent',
                    color: vehicleType === 'car' ? '#064e3b' : '#666',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: vehicleType === 'car' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  🚗 Car Loan
                </button>
                <button
                  onClick={() => handleTypeSwitch('bike')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: vehicleType === 'bike' ? 'white' : 'transparent',
                    color: vehicleType === 'bike' ? '#064e3b' : '#666',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: vehicleType === 'bike' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  🏍️ Bike Loan
                </button>
              </div>

              <div style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px', display: 'inline-block', paddingBottom: '4px', color: '#064e3b', borderBottom: '2px solid #064e3b' }}>
                Vehicle Loan
              </div>
              <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#064e3b', lineHeight: 1.1, marginBottom: '20px' }}>
                {vehicleType === 'car' ? 'Drive Home Your\nDream Car' : 'Ride Your Passion\nToday'}
              </h1>
              <p className="subtext" style={{ color: '#4b5563', fontSize: '20px', marginBottom: '40px' }}>
                {vehicleType === 'car'
                  ? 'Get up to 100% on-road funding. Rates starting at 8.5% p.a.'
                  : 'Instant two-wheeler loans with minimal documentation.'}
              </p>

              <div className="input-group-kar" style={{ background: 'transparent', gap: '16px', flexDirection: 'column', height: 'auto' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button onClick={() => setContactMethod('mobile')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'mobile' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'mobile' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Mobile Number</button>
                  <button onClick={() => setContactMethod('email')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'email' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'email' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Email ID</button>
                </div>
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  {contactMethod === 'mobile' && (
                    <div className="input-box-kar" style={{ flex: '0.3', background: '#f3f4f6', border: 'none' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>🇮🇳 +91</span>
                    </div>
                  )}
                  <div className="input-box-kar" style={{ flex: contactMethod === 'mobile' ? '0.7' : '1', background: '#f3f4f6', border: 'none' }}>
                    <input
                      type={contactMethod === 'mobile' ? 'text' : 'email'}
                      placeholder={contactMethod === 'mobile' ? 'Enter mobile number' : 'Enter email address'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      style={{ color: '#111827', background: 'transparent' }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-kar"
                disabled={!isTermsChecked}
                onClick={() => handleApply({ type: contactMethod, value: inputValue })}
                style={{
                  borderRadius: '12px',
                  background: isTermsChecked ? '#6ee7b7' : '#d1fae5',
                  color: isTermsChecked ? '#064e3b' : '#9ca3af',
                  fontWeight: 800,
                  boxShadow: isTermsChecked ? '0 10px 20px -5px rgba(16, 185, 129, 0.4)' : 'none',
                  cursor: isTermsChecked ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  marginTop: '0'
                }}
              >
                Apply Now
              </button>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  <span>By proceeding, you agree with our <a href="#" onClick={(e) => { e.preventDefault(); navigateData('terms'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</a> & <a href="#" onClick={(e) => { e.preventDefault(); navigateData('privacy'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</a></span>
                </label>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isWhatsappChecked}
                    onChange={(e) => setIsWhatsappChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  I agree to receive updates on Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={vehicleType === 'car' ? "/car_loan_hero.png" : "/bike_loan_hero.png"}
              alt={vehicleType === 'car' ? "Car Loan" : "Bike Loan"}
              style={{ maxWidth: '100%', maxHeight: '500px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400/png?text=Vehicle+Image";
              }}
            />
          </div>
        </div>
      </section>

      {/* Vehicle EMI Calculator */}
      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '40px', textAlign: 'center' }}>
          {vehicleType === 'car' ? 'Car Loan EMI Calculator' : 'Two-Wheeler Loan EMI Calculator'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', background: '#f0f9ff', padding: '40px', borderRadius: '30px' }}>
          <div>
            {/* Sliders */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontWeight: 700 }}>Loan Amount</label>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800 }}>₹ {loanAmount.toLocaleString('en-IN')}</div>
              </div>
              <input
                type="range"
                min={vehicleType === 'car' ? "100000" : "20000"}
                max={vehicleType === 'car' ? "2000000" : "300000"}
                step={vehicleType === 'car' ? "50000" : "10000"}
                value={loanAmount}
                onChange={e => setLoanAmount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: vehicleType === 'car' ? '#3b82f6' : '#ef4444' }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontWeight: 700 }}>Tenure (Months)</label>
                <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 800 }}>{tenure} Months</div>
              </div>
              <input
                type="range"
                min="12"
                max={vehicleType === 'car' ? "84" : "60"}
                step="6"
                value={tenure}
                onChange={e => setTenure(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: vehicleType === 'car' ? '#3b82f6' : '#ef4444' }}
              />
            </div>

            <p style={{ fontSize: '14px', color: '#666' }}>* Interest rate assumed at <strong>{interest}%</strong> for calculation.</p>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--kar-shadow-sm)' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>Your Monthly EMI</p>
            <h3 style={{ fontSize: '42px', fontWeight: 900, color: vehicleType === 'car' ? '#3b82f6' : '#ef4444', marginBottom: '8px' }}>₹ {calculateEMI(loanAmount, tenure, interest)}</h3>
            <p style={{ fontSize: '13px', color: '#999' }}>for {tenure} months</p>

            <button className="btn-kar" style={{ width: '100%', marginTop: '24px', background: vehicleType === 'car' ? '#1e3a8a' : '#b91c1c' }}>Apply Now</button>
          </div>
        </div>
      </section>

      {/* Docs for Vehicle */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Documents Checklist</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: 'KYC Documents', icon: '🆔' },
              { title: 'Bank Statements', icon: '🏦' },
              { title: vehicleType === 'car' ? 'Income Proof' : 'No Income Proof*', icon: '📄' }, // Tweaked for bike
              { title: 'Vehicle Quotation', icon: '🚗' }
            ].map((doc, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--kar-shadow-sm)' }}>
                <div style={{ fontSize: '32px', background: '#f3f4f6', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{doc.icon}</div>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Extracted Component: Medical Loan
const MedicalLoanPage = ({ onApply, navigateData }) => {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(true);
  const [contactMethod, setContactMethod] = useState('mobile');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="medical-loan-page fade-in">
      <section className="hero-kar medical-hero" style={{ background: '#ffffff', color: '#111827' }}>
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#111827' }}>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, display: 'inline-block', marginBottom: '20px' }}>URGENT CARE</div>
              <div style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px', display: 'inline-block', paddingBottom: '4px', color: '#064e3b', borderBottom: '2px solid #064e3b' }}>
                Medical Loan
              </div>
              <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#064e3b', lineHeight: 1.1, marginBottom: '24px' }}>
                Health Comes First.<br />Finances Can Wait.
              </h1>
              <p className="subtext" style={{ color: '#4b5563', fontSize: '20px', marginBottom: '40px' }}>
                Get instant medical loans up to <span style={{ color: '#064e3b', fontWeight: 800 }}>₹10 Lakhs</span> within 30 minutes.
              </p>

              <div className="input-group-kar" style={{ background: 'transparent', gap: '16px', flexDirection: 'column', height: 'auto' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <button onClick={() => setContactMethod('mobile')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'mobile' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'mobile' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Mobile Number</button>
                  <button onClick={() => setContactMethod('email')} style={{ border: 'none', background: 'transparent', borderBottom: contactMethod === 'email' ? '2px solid #064e3b' : 'none', fontWeight: 700, color: contactMethod === 'email' ? '#064e3b' : '#9ca3af', cursor: 'pointer', paddingBottom: '4px' }}>Email ID</button>
                </div>
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  {contactMethod === 'mobile' && (
                    <div className="input-box-kar" style={{ flex: '0.3', background: '#f3f4f6', border: 'none' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>🇮🇳 +91</span>
                    </div>
                  )}
                  <div className="input-box-kar" style={{ flex: contactMethod === 'mobile' ? '0.7' : '1', background: '#f3f4f6', border: 'none' }}>
                    <input
                      type={contactMethod === 'mobile' ? 'text' : 'email'}
                      placeholder={contactMethod === 'mobile' ? 'Enter mobile number' : 'Enter email address'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      style={{ color: '#111827', background: 'transparent' }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-kar"
                disabled={!isTermsChecked}
                onClick={() => onApply({ type: 'medical_loan', contactMethod, value: inputValue })}
                style={{
                  borderRadius: '12px',
                  background: isTermsChecked ? '#6ee7b7' : '#d1fae5',
                  color: isTermsChecked ? '#064e3b' : '#9ca3af',
                  fontWeight: 800,
                  boxShadow: isTermsChecked ? '0 10px 20px -5px rgba(16, 185, 129, 0.4)' : 'none',
                  cursor: isTermsChecked ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  marginTop: '0'
                }}
              >
                Apply Now
              </button>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isTermsChecked}
                    onChange={(e) => setIsTermsChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  <span>By proceeding, you agree with our <a href="#" onClick={(e) => { e.preventDefault(); navigateData('terms'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Terms & Conditions</a> & <a href="#" onClick={(e) => { e.preventDefault(); navigateData('privacy'); }} style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</a></span>
                </label>
                <label style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#666', cursor: 'pointer', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isWhatsappChecked}
                    onChange={(e) => setIsWhatsappChecked(e.target.checked)}
                    style={{ accentColor: '#064e3b', width: 18, height: 18, border: '2px solid #e5e7eb', borderRadius: '4px' }}
                  />
                  I agree to receive updates on Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}>🩺❤️</div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--kar-text-main)', marginBottom: '60px', textAlign: 'center' }}>Why Karoloans used for Expenses?</h2>
        <div className="bento-grid" style={{ marginTop: 0 }}>
          <div className="bento-item" style={{ background: '#ecfeff', border: '1px solid #cffafe' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>30 Min Disbursal</h3>
            <p style={{ color: '#666' }}>We understand emergencies. Funds in your account instantly.</p>
          </div>
          <div className="bento-item" style={{ background: '#fff1f2', border: '1px solid #ffe4e6' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏥</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Direct to Hospital</h3>
            <p style={{ color: '#666' }}>Option to disburse directly to the hospital billing desk.</p>
          </div>
          <div className="bento-item" style={{ background: '#fcfafa', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧘</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Low Cost EMI</h3>
            <p style={{ color: '#666' }}>Focus on recovery, not bills. Pay back in easy EMIs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};



// Extracted Component: Vehicle Insurance
const VehicleInsurancePage = ({ onApply }) => {
  const [vehicleType, setVehicleType] = useState('car'); // 'car' or 'bike'
  const [registrationNumber, setRegistrationNumber] = useState('');

  return (
    <div className="vehicle-insurance-page fade-in">
      <section className="hero-kar insurance-hero" style={{ background: '#ffffff', color: '#111827' }}>
        <div className="container hero-layout-kar">
          <div className="hero-left-kar">
            <div className="hero-card-kar" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#111827' }}>

              {/* Toggle Switch */}
              <div style={{ display: 'flex', background: '#f0fdf4', borderRadius: '30px', padding: '4px', marginBottom: '24px', width: 'fit-content', border: '1px solid #dcfce7' }}>
                <button
                  onClick={() => setVehicleType('car')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: vehicleType === 'car' ? '#15803d' : 'transparent',
                    color: vehicleType === 'car' ? 'white' : '#15803d',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: vehicleType === 'car' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  🚗 Car Insurance
                </button>
                <button
                  onClick={() => setVehicleType('bike')}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: vehicleType === 'bike' ? '#15803d' : 'transparent',
                    color: vehicleType === 'bike' ? 'white' : '#15803d',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: vehicleType === 'bike' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  🏍️ Bike Insurance
                </button>
              </div>

              <div style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', display: 'inline-block', paddingBottom: '4px', color: '#15803d', borderBottom: '2px solid #15803d' }}>
                Vehicle Insurance
              </div>
              <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#15803d', lineHeight: 1.1, marginBottom: '24px' }}>
                Protect Your {vehicleType === 'car' ? 'Car' : 'Bike'}.<br />Save Your Wallet.
              </h1>
              <p className="subtext" style={{ color: '#4b5563', fontSize: '20px', marginBottom: '40px' }}>
                {vehicleType === 'car'
                  ? 'Comprehensive car insurance starting at ₹2099/year*'
                  : 'Two-wheeler insurance starting at just ₹499/year*'}
              </p>

              <div className="input-group-kar" style={{ background: 'transparent', gap: '16px', flexDirection: 'column', height: 'auto' }}>
                <div className="input-box-kar" style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '18px 24px', borderRadius: '14px' }}>
                  <input
                    type="text"
                    placeholder="Enter Vehicle Registration Number (e.g. KA01AB1234)"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    style={{ color: '#111827', background: 'transparent', width: '100%', fontSize: '16px', fontWeight: 600, letterSpacing: '1px' }}
                  />
                </div>
              </div>

              <button
                className="btn-kar"
                onClick={() => onApply({ type: 'vehicle_reg', value: registrationNumber })}
                style={{
                  borderRadius: '12px',
                  background: '#15803d',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '18px',
                  marginTop: '0',
                  boxShadow: '0 10px 20px -5px rgba(21, 128, 61, 0.4)'
                }}
              >
                Get Quote Instantly
              </button>

              <div style={{ marginTop: '24px', display: 'flex', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  <div style={{ color: '#15803d' }}>✓</div> 5000+ Cashless Garages
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                  <div style={{ color: '#15803d' }}>✓</div> 98% Claim Settlement
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual-kar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}>
              {vehicleType === 'car' ? '🛡️🚗' : '🛡️🏍️'}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#111827', marginBottom: '60px', textAlign: 'center' }}>Why choose Karoloans Insurance?</h2>
        <div className="bento-grid" style={{ marginTop: 0 }}>
          <div className="bento-item" style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px', color: '#166534' }}>Instant Policy Issuance</h3>
            <p style={{ color: '#666' }}>No paperwork. Get your policy in your inbox in 2 minutes.</p>
          </div>
          <div className="bento-item" style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🛠️</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px', color: '#1e40af' }}>Cashless Repairs</h3>
            <p style={{ color: '#666' }}>Network of 5000+ garages across India.</p>
          </div>
          <div className="bento-item" style={{ background: '#fef2f2', border: '1px solid #fee2e2' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📞</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px', color: '#991b1b' }}>24x7 Claims Support</h3>
            <p style={{ color: '#666' }}>Dedicated relationship manager for claims assistance.</p>
          </div>
          <div className="bento-item" style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
            <h3 style={{ fontWeight: 800, marginBottom: '8px', color: '#92400e' }}>No Claim Bonus</h3>
            <p style={{ color: '#666' }}>Transfer up to 50% NCB from your old insurance policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Extracted Component: Generic EMI Calculator Modal
const EMICalculatorModal = ({ type, onClose }) => {
  // Defaults based on loan type
  const defaults = {
    'Personal Loan': { min: 10000, max: 2500000, defaultAmt: 100000, minRate: 10, maxRate: 36, defaultRate: 16, minTenure: 3, maxTenure: 72, defaultTenure: 6, step: 5000 },
    'Home Loan': { min: 500000, max: 10000000, defaultAmt: 2500000, minRate: 7, maxRate: 15, defaultRate: 8.5, minTenure: 12, maxTenure: 360, defaultTenure: 120, step: 50000 }, // Tenure in months
    'Car Loan': { min: 100000, max: 5000000, defaultAmt: 600000, minRate: 8, maxRate: 20, defaultRate: 9, minTenure: 12, maxTenure: 84, defaultTenure: 48, step: 10000 },
  };

  const config = defaults[type] || defaults['Personal Loan'];

  const [amount, setAmount] = useState(config.defaultAmt);
  const [rate, setRate] = useState(config.defaultRate);
  const [tenure, setTenure] = useState(config.defaultTenure);

  const calculateEMI = () => {
    const r = rate / 12 / 100;
    const n = tenure;
    if (r === 0) return Math.round(amount / n);
    const emi = (amount / n) + (amount * r);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - amount;

  // Donut Chart Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const principalPercent = (amount / totalAmount);
  const interestPercent = (totalInterest / totalAmount);
  // Stroke Dash Array: [filled, empty]
  // We want the Interest to be the 'filled' part usually or vice versa.
  // Let's make Principal (Green) and Interest (Light Green/Grey)
  // Actually, in the image: Green is Loan Amount, Purple is Interest.

  const greenStroke = circumference * principalPercent;
  const purpleStroke = circumference * interestPercent;

  // Create a gap for visual separation if needed

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '900px', background: '#f0fdf4', borderRadius: '24px', padding: '40px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#166534' }}>✕</button>

        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 900, marginBottom: '40px', color: '#111827' }}>{type} EMI Calculator</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>

          {/* Left Panel: Results */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#4b5563', marginBottom: '8px' }}>Your monthly EMI is</p>
              <h3 style={{ fontSize: '42px', fontWeight: 800, color: '#15803d', margin: 0 }}>₹{emi.toLocaleString('en-IN')}</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>for {tenure} months</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '32px', padding: '0 20px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Total Interest</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>₹{totalInterest.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Total Amount</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Simple Custom Donut Chart using SVG */}
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="60" fill="transparent" stroke="#e5e7eb" strokeWidth="20" /> {/* Base/Empty */}
                <circle
                  cx="80" cy="80" r="60"
                  fill="transparent"
                  stroke="#15803d"
                  strokeWidth="20"
                  strokeDasharray={`${greenStroke} ${circumference}`}
                />
                <circle
                  cx="80" cy="80" r="60"
                  fill="transparent"
                  stroke="#d8b4fe" // Light Purple for Interest
                  strokeWidth="20"
                  strokeDasharray={`${purpleStroke} ${circumference}`}
                  strokeDashoffset={-greenStroke}
                />
              </svg>
              {/* Center text could go here if needed */}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '24px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#15803d' }}></div>
                <span>Loan Amount</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d8b4fe' }}></div>
                <span>Total Interest</span>
              </div>
            </div>

          </div>

          {/* Right Panel: Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '10px' }}>

            {/* Amount Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>Loan Amount</label>
                <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', width: '140px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', marginRight: '4px' }}>₹</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ border: 'none', width: '100%', fontWeight: 700, textAlign: 'right', outline: 'none' }}
                  />
                </div>
              </div>
              <input type="range" min={config.min} max={config.max} step={config.step} value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', accentColor: '#15803d', height: '6px', background: '#d1d5db', borderRadius: '3px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <span>Min ₹{config.min.toLocaleString()}</span>
                <span>Max ₹{config.max.toLocaleString()}</span>
              </div>
            </div>

            {/* Interest Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>Rate of Interest</label>
                <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', width: '80px', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    style={{ border: 'none', width: '100%', fontWeight: 700, textAlign: 'right', outline: 'none' }}
                  />
                  <span style={{ color: '#6b7280', marginLeft: '4px' }}>%</span>
                </div>
              </div>
              <input type="range" min={config.minRate} max={config.maxRate} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', accentColor: '#15803d', height: '6px', background: '#d1d5db', borderRadius: '3px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <span>Min {config.minRate}%</span>
                <span>Max {config.maxRate}%</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontSize: '15px', fontWeight: 700, color: '#374151' }}>Loan Tenure</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', width: '80px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      style={{ border: 'none', width: '100%', fontWeight: 700, textAlign: 'center', outline: 'none' }}
                    />
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '14px', color: '#374151' }}>months ▾</div>
                </div>
              </div>
              <input type="range" min={config.minTenure} max={config.maxTenure} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} style={{ width: '100%', accentColor: '#15803d', height: '6px', background: '#d1d5db', borderRadius: '3px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                <span>Min {config.minTenure} months</span>
                <span>Max {config.maxTenure} months</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button className="btn-kar" style={{ width: '100%', background: '#064e3b', borderRadius: '8px', padding: '16px', fontSize: '16px' }}>Apply Now</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
