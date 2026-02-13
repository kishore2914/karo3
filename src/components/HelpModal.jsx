import React, { useState } from 'react';

/* FAQ Data */
const faqData = [
    { question: "What happens if the app crashes when I'm midway through my loan application process?", answer: "Don't worry! Your progress is automatically saved. You can resume exactly where you left off by reopening the app." },
    { question: "I am unable to fill in my current address. What should I do?", answer: "Please ensure your GPS is enabled and you have granted location permissions. If the issue persists, try entering the address manually or contact support." },
    { question: "I do not have a work email, can I provide my personal email ID?", answer: "Yes, you can provide your personal email ID, but providing a work email helps in faster verification and better loan offers." },
    { question: "Can I use any bank that's not recognised by Karoloans to borrow or repay my loan?", answer: "We support most major banks. If your bank is not listed, please contact our support team to check if we can process your application." },
    { question: "What do you mean by credit score?", answer: "A credit score is a numerical representation of your creditworthiness, ranging from 300 to 900. A higher score indicates better credit health." },
    { question: "How does my credit score get affected by this loan?", answer: "Timely repayments can improve your score, while missed payments or defaults may negatively impact it." },
    { question: "Will Karoloans check for my credit report (For Ex:CIBIL) for loan processing?", answer: "Yes, we check your credit report to assess your eligibility and offer you the best interest rates." },
    { question: "Will my credit score be affected if I get rejected?", answer: "A single rejection usually has a minor impact, but multiple frequent applications and rejections can negatively affect your score." }
];

const HelpModal = ({ onClose }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ background: 'white', width: '90%', maxWidth: '500px', maxHeight: '85vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'slideUp 0.3s ease-out' }}
            >

                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Don't Worry ! We are here to help</h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    {faqData.map((item, index) => (
                        <div key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <div
                                onClick={() => toggleAccordion(index)}
                                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', background: openIndex === index ? '#f8fafc' : 'white' }}
                            >
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#374151', lineHeight: '1.5' }}>{item.question}</div>
                                <svg
                                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s', color: '#9ca3af', minWidth: '20px', marginTop: '2px' }}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                            {openIndex === index && (
                                <div style={{ padding: '0 24px 24px 24px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', background: '#f8fafc' }}>
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb', background: 'white' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#f9fafb' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064e3b', flexShrink: 0 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '4px', marginTop: '0' }}>Not able to find your question?</h4>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                                You may get in touch with us on <a href="mailto:loans@karoloans.in" style={{ color: '#064e3b', fontWeight: 700, textDecoration: 'underline' }}>loans@karoloans.in</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
