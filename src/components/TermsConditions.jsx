import React from 'react';

const TermsConditions = ({ onBack }) => {
    return (
        <div className="legal-page fade-in" style={{ padding: '40px 0', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '800px', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <button onClick={onBack} style={{ marginBottom: '24px', background: 'none', border: 'none', color: 'var(--kar-emerald)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ← Back
                </button>

                <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#111827' }}>Terms and Conditions</h1>
                <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>Last Updated: February 2026</p>

                <div style={{ lineHeight: '1.6', color: '#374151' }}>
                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>1. Introduction</h3>
                        <p>Welcome to Karoloans. By accessing or using our website and services, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>2. Use of Services</h3>
                        <p>You must be at least 18 years old and a resident of India to apply for a loan. You agree to provide accurate, current, and complete information during the application process.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>3. Loan Approval</h3>
                        <p>Loan approval is subject to eligibility checks, credit score verification, and document validation. Karoloans reserves the right to approve or reject any application at its sole discretion.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>4. Interest and Repayment</h3>
                        <p>Interest rates and repayment terms will be clearly communicated in the loan agreement. You agree to repay the loan amount along with applicable interest and fees within the stipulated tenure.</p>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>5. Limitation of Liability</h3>
                        <p>Karoloans shall not be liable for any indirect, incidental, special, consequential, or punitive damages associated with your use of the services.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
