import React from 'react';

const ApplicationStatus = ({ currentStep, onContinue }) => {
    const steps = [
        { id: 1, title: 'Loan application', status: 'Completed', description: 'Complete your loan application in few minutes to get a loan' },
        { id: 2, title: 'Document verification', status: 'Pending', description: 'Upload KYC documents for verification' },
        { id: 3, title: 'Enable EMI auto debit (NACH)', status: 'Pending', description: 'Set up auto-debit for hassle-free repayments' },
        { id: 4, title: 'Review and submit agreement', status: 'Pending', description: 'Sign the loan agreement digitally' },
        { id: 5, title: 'Money transfer to bank', status: 'Pending', description: 'Get funds credited to your account' }
    ];

    const getStatusBadge = (stepId) => {
        if (stepId < currentStep) {
            return <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Completed</span>;
        } else if (stepId === currentStep) {
            // For step 5 specifically, if it's the current step (5), it's "In Progress".
            // If currentStep becomes 6 (disbursed), the check above (stepId < currentStep) handles it as "Completed".
            return <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>In Progress</span>;
        } else {
            return <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Pending</span>;
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '32px', color: '#111827' }}>Application Status</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} style={{
                            background: 'white',
                            border: isActive ? '2px solid #064e3b' : '1px solid #e5e7eb',
                            borderRadius: '16px',
                            padding: '24px',
                            transition: 'all 0.3s ease',
                            boxShadow: isActive ? '0 10px 25px -5px rgba(0,0,0,0.1)' : 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isActive ? '16px' : '0' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isActive || isCompleted ? '#064e3b' : '#e5e7eb',
                                        color: isActive || isCompleted ? 'white' : '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '14px'
                                    }}>
                                        {isCompleted ? '✓' : step.id}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: isActive ? '#064e3b' : '#374151', margin: 0 }}>{step.title}</h3>
                                        {isActive && <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>{step.description}</p>}
                                    </div>
                                </div>
                                {getStatusBadge(step.id)}
                            </div>

                            {isActive && (
                                <button
                                    onClick={() => onContinue(step.id)}
                                    style={{
                                        width: '100%',
                                        marginTop: '8px',
                                        background: '#064e3b',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Complete now
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationStatus;
