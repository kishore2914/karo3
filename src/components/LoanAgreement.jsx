import React, { useState } from 'react';

const LoanAgreement = ({ onComplete, onBack }) => {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', position: 'relative' }}>
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
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '30px' }}>
                <h2 style={{ marginBottom: '24px', color: '#111827', textAlign: 'center' }}>Loan Agreement</h2>

                <div style={{
                    height: '400px',
                    overflowY: 'scroll',
                    border: '1px solid #e5e7eb',
                    padding: '24px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    background: '#f9fafb',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151'
                }}>
                    <h4 style={{ marginTop: 0 }}>LOAN AGREEMENT TERMS AND CONDITIONS</h4>
                    <p>This Loan Agreement is made between the Borrower (You) and Whizdm Finance Pvt Ltd (Lender).</p>

                    <p><strong>1. LOAN AMOUNT AND TENURE</strong><br />
                        The Lender agrees to lend the Loan Amount specified in the Sanction Letter. The Borrower agrees to repay the loan within the specified Tenure.</p>

                    <p><strong>2. INTEREST AND CHARGES</strong><br />
                        Interest shall be charged at the rate specified in the Sanction Letter. Processing fees and other charges are applicable as per the Key Fact Statement (KFS).</p>

                    <p><strong>3. REPAYMENT</strong><br />
                        The Borrower shall repay the loan in Equated Monthly Installments (EMIs) on or before the due date. Late payment charges will apply for any delays.</p>

                    <p><strong>4. PREPAYMENT</strong><br />
                        Prepayment of the loan is allowed subject to the terms mentioned in the KFS. Foreclosure charges may apply.</p>

                    <p><strong>5. DEFAULT</strong><br />
                        In case of default, the Lender has the right to recall the entire loan amount and take legal action for recovery.</p>

                    <p><strong>6. CREDIT REPORTING</strong><br />
                        The Borrower authorizes the Lender to report loan details and repayment history to Credit Information Companies (CICs) like CIBIL, Equifax, etc.</p>

                    <p><strong>7. GOVERNING LAW</strong><br />
                        This agreement shall be governed by the laws of India and subject to the jurisdiction of courts in Bengaluru.</p>

                    <p>... (End of Agreement) ...</p>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '16px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ marginTop: '4px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#064e3b', fontWeight: 500 }}>
                        I have read and understood the Loan Agreement, Key Fact Statement (KFS), and Terms & Conditions. I agree to abide by them.
                    </span>
                </label>

                <button
                    className="btn-kar"
                    onClick={onComplete}
                    disabled={!agreed}
                    style={{
                        marginTop: '32px',
                        background: agreed ? '#064e3b' : '#cbd5e1',
                        cursor: agreed ? 'pointer' : 'not-allowed',
                        boxShadow: agreed ? '0 10px 20px -5px rgba(6, 78, 59, 0.4)' : 'none'
                    }}
                >
                    Accept & Sign Agreement
                </button>
            </div>
        </div>
    );
};

export default LoanAgreement;
