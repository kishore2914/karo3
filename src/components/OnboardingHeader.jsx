import React, { useState } from 'react';
import HelpModal from './HelpModal';

const OnboardingHeader = ({ mobileNumber, onLogout }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    // Mask the mobile number (show only last 4 digits)
    const maskedNumber = mobileNumber ? `xxxxxx${mobileNumber.slice(-4)}` : 'xxxxxx----';

    return (
        <div style={{ height: '64px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
            {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

            <div style={{ fontSize: '18px', fontWeight: 700, color: '#064e3b', letterSpacing: '-0.5px' }}>Karoloans</div>
            <div style={{ display: 'flex', gap: '20px', color: '#374151', position: 'relative' }}>
                <svg
                    onClick={() => setShowHelpModal(true)}
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}
                >
                    <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>

                <div style={{ position: 'relative' }}>
                    <svg
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                    </svg>

                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            marginTop: '12px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            padding: '24px',
                            minWidth: '280px',
                            zIndex: 100
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>{maskedNumber}</div>
                            </div>

                            <div style={{ height: '1px', background: '#e5e7eb', margin: '0 0 20px 0' }}></div>

                            <div
                                onClick={onLogout}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563', cursor: 'pointer', fontSize: '15px' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingHeader;
