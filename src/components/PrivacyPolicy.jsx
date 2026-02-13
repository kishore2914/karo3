import React from 'react';

const PrivacyPolicy = ({ onBack }) => {
    return (
        <div className="legal-page fade-in" style={{ padding: '40px 0', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '800px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <button onClick={onBack} style={{ marginBottom: '24px', background: 'none', border: 'none', color: 'var(--kar-emerald)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ← Back
                </button>

                <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#111827' }}>Privacy Policy</h1>
                <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>Last Updated: February 2026</p>

                <div style={{ lineHeight: '1.6', color: '#374151' }}>
                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>1. Information We Collect</h3>
                        <p>We collect personal information such as your name, contact details, PAN number, employment details, and banking information to process your loan application.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>2. How We Use Your Information</h3>
                        <p>Your information is used for credit assessment, KYC verification, loan processing, and to communicate with you regarding your application and our services.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>3. Data Security</h3>
                        <p>We implement industry-standard security measures to protect your data. Your information is encrypted and stored securely. We do not sell your personal data to third parties.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>4. Third-Party Sharing</h3>
                        <p>We may share your information with credit bureaus and regulated financial partners solely for the purpose of processing your loan and facilitating collections.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>5. Your Rights</h3>
                        <p>You have the right to access, correct, or request deletion of your personal data, subject to regulatory retention requirements.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
