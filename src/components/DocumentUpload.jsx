import React, { useState } from 'react';
import API_BASE_URL from '../config/apiConfig';

const DocumentUpload = ({ loanId, onComplete, onBack }) => {
    const [files, setFiles] = useState({
        pan: null,
        aadhaar: null,
        photo: null,
        statement: null,
        passbook: null
    });

    const handleFileChange = (e, type) => {
        setFiles({ ...files, [type]: e.target.files[0] });
    };

    const isComplete = files.pan && files.aadhaar && files.photo && files.statement && files.passbook;

    return (
        <div className="doc-upload fade-in" style={{ padding: '40px 20px', minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={onBack}
                    className="back-btn"
                    style={{
                        position: 'absolute',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        color: '#64748b',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#064e3b', marginBottom: '12px' }}>Digital KYC Compliance</h2>
                    <p style={{ color: '#64748b', fontSize: '16px' }}>Upload your documents to proceed with disbursal</p>
                </div>

                <div className="upload-grid">
                    <div className="upload-card">
                        <div className="card-header">
                            <span className="icon">🪪</span>
                            <label>PAN Card</label>
                        </div>
                        <div className={`file-drop-area ${files.pan ? 'active' : ''}`}>
                            <input type="file" onChange={(e) => handleFileChange(e, 'pan')} />
                            {!files.pan && <span className="placeholder">Choose file...</span>}
                            {files.pan && <span className="file-name">{files.pan.name}</span>}
                        </div>
                        {files.pan && <div className="status-badge">✅ Uploaded</div>}
                    </div>

                    <div className="upload-card">
                        <div className="card-header">
                            <span className="icon">🆔</span>
                            <label>Aadhaar Card (Front & Back)</label>
                        </div>
                        <div className={`file-drop-area ${files.aadhaar ? 'active' : ''}`}>
                            <input type="file" onChange={(e) => handleFileChange(e, 'aadhaar')} />
                            {!files.aadhaar && <span className="placeholder">Choose file...</span>}
                            {files.aadhaar && <span className="file-name">{files.aadhaar.name}</span>}
                        </div>
                        {files.aadhaar && <div className="status-badge">✅ Uploaded</div>}
                    </div>

                    <div className="upload-card">
                        <div className="card-header">
                            <span className="icon">👤</span>
                            <label>Passport Size Photo</label>
                        </div>
                        <div className={`file-drop-area ${files.photo ? 'active' : ''}`}>
                            <input type="file" onChange={(e) => handleFileChange(e, 'photo')} />
                            {!files.photo && <span className="placeholder">Choose file...</span>}
                            {files.photo && <span className="file-name">{files.photo.name}</span>}
                        </div>
                        {files.photo && <div className="status-badge">✅ Uploaded</div>}
                    </div>

                    <div className="upload-card">
                        <div className="card-header">
                            <span className="icon">📄</span>
                            <label>Bank Statement (Last 3 months)</label>
                        </div>
                        <div className={`file-drop-area ${files.statement ? 'active' : ''}`}>
                            <input type="file" onChange={(e) => handleFileChange(e, 'statement')} />
                            {!files.statement && <span className="placeholder">Choose file...</span>}
                            {files.statement && <span className="file-name">{files.statement.name}</span>}
                        </div>
                        {files.statement && <div className="status-badge">✅ Uploaded</div>}
                    </div>

                    <div className="upload-card">
                        <div className="card-header">
                            <span className="icon">📒</span>
                            <label>Bank Passbook</label>
                        </div>
                        <div className={`file-drop-area ${files.passbook ? 'active' : ''}`}>
                            <input type="file" onChange={(e) => handleFileChange(e, 'passbook')} />
                            {!files.passbook && <span className="placeholder">Choose file...</span>}
                            {files.passbook && <span className="file-name">{files.passbook.name}</span>}
                        </div>
                        {files.passbook && <div className="status-badge">✅ Uploaded</div>}
                    </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        className="btn-kar"
                        disabled={!isComplete}
                        onClick={async () => {
                            const token = localStorage.getItem('token');
                            if (!token) return alert('Please login again');

                            try {
                                // Upload all files
                                const uploadPromises = Object.entries(files).map(async ([key, file]) => {
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('doc_type', key);
                                    if (loanId) formData.append('loan_id', loanId);

                                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/upload`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: formData
                                    });
                                    if (!res.ok) throw new Error(`Failed to upload ${key}`);
                                });

                                await Promise.all(uploadPromises);
                                onComplete();
                            } catch (err) {
                                console.error(err);
                                alert('Failed to upload one or more documents. Please try again.');
                            }
                        }}
                        style={{
                            padding: '18px 48px',
                            fontSize: '18px',
                            fontWeight: 700,
                            borderRadius: '16px',
                            background: isComplete ? '#064e3b' : '#cbd5e1',
                            color: isComplete ? 'white' : '#64748b',
                            border: 'none',
                            cursor: isComplete ? 'pointer' : 'not-allowed',
                            boxShadow: isComplete ? '0 10px 25px -5px rgba(6, 78, 59, 0.4)' : 'none',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            maxWidth: '400px'
                        }}
                    >
                        {isComplete ? 'Submit for Verification' : 'Upload All Documents'}
                    </button>
                </div>
            </div>

            <style>{`
                .upload-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }
                
                .back-btn {
                    top: 40px;
                    left: 40px;
                }

                @media (max-width: 768px) {
                    .upload-grid {
                        grid-template-columns: 1fr;
                    }

                    .back-btn {
                        top: 20px !important;
                        left: 20px !important;
                        position: static !important;
                        margin-bottom: 20px;
                        width: fit-content;
                    }
                    
                    .doc-upload {
                         padding-top: 20px !important;
                    }
                }
                
                .upload-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid #f1f5f9;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .upload-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transform: translateY(-4px);
                    border-color: #d1fae5;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .card-header .icon {
                    font-size: 24px;
                    background: #ecfdf5;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }

                .card-header label {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 16px;
                }

                .file-drop-area {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    background: #f8fafc;
                    transition: 0.2s;
                    min-height: 60px;
                }

                .file-drop-area:hover {
                    background: #f0fdf4;
                    border-color: #064e3b;
                }

                .file-drop-area.active {
                    background: #ecfdf5;
                    border-color: #064e3b;
                    border-style: solid;
                }

                .file-drop-area input[type=file] {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    z-index: 10;
                }

                .file-drop-area .placeholder {
                    color: #64748b;
                    font-size: 14px;
                }
                
                .file-drop-area .file-name {
                    color: #064e3b;
                    font-weight: 600;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .status-badge {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #064e3b;
                    background: #d1fae5;
                    padding: 4px 12px;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

export default DocumentUpload;
