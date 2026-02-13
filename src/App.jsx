import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DocumentUpload from './components/DocumentUpload';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ApplicationStatus from './components/ApplicationStatus';
import NachSetup from './components/NachSetup';
import LoanAgreement from './components/LoanAgreement';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainHome() {
  const [currentView, setCurrentView] = React.useState('landing'); // landing, dashboard
  const [user, setUser] = React.useState(null);
  const [loanOffer, setLoanOffer] = React.useState(null);
  const [selectedLoanType, setSelectedLoanType] = React.useState('Personal Loan');
  const [loanDetails, setLoanDetails] = React.useState(null);

  const [applicationStep, setApplicationStep] = React.useState(2); // 1: App, 2: Docs, 3: NACH, 4: Agreement, 5: Transfer
  const [activeTask, setActiveTask] = React.useState(null); // 'docs', 'nach', 'agreement'

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user profile to hydrate state
      fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            setUser({ firstName: data.first_name, ...data });

            // Check loan status
            fetch(`${import.meta.env.VITE_API_URL}/api/loans`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(loans => {
                if (loans && loans.length > 0) {
                  const latest = loans[0];
                  if (latest.status === 'disbursed') {
                    setApplicationStep(6); // All steps completed
                  } else if (latest.status === 'approved') {
                    setApplicationStep(5); // Money transfer pending
                  } else {
                    // Use persisted step or default to 2
                    setApplicationStep(latest.application_step || 2);
                  }
                  setLoanOffer(latest.amount);
                  setLoanDetails({ loanId: latest.id, amount: latest.amount }); // Restore loanId
                  // setCurrentView('dashboard'); // Removed to show Landing Page on refresh as per user request
                } else {
                  // No loan, check profile steps
                  if (!data.pan_number) setApplicationStep(1);
                  else setApplicationStep(2);
                }
              });
          }
        })
        .catch(err => console.error("Session restore failed", err));
    }
  }, []);

  const handleApplicationComplete = (data) => {
    // Called when the new LoanApplicationFlow finishes
    if (data && data.user) {
      setUser(data.user);
    }
    if (data && data.loanType) {
      setSelectedLoanType(data.loanType);
    }

    // New flow includes documents (Step 2), so we move to Step 3 (NACH)
    setApplicationStep(3);
    // setActiveTask('nach'); // Removed as per request to redirect to landing page

    if (data && data.loanId) {
      setLoanDetails({ loanId: data.loanId });
    }

    // alert("Application Submitted Successfully! Redirecting to Home.");
    setCurrentView('landing');
  };

  const handleTaskComplete = async () => {
    const nextStep = applicationStep + 1;
    setApplicationStep(nextStep);
    // Auto-advance to next task
    if (nextStep === 3) setActiveTask('nach');
    else if (nextStep === 4) setActiveTask('agreement');
    else setActiveTask(null);

    // Persist step to backend
    if (loanDetails && loanDetails.loanId) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${import.meta.env.VITE_API_URL}/api/loans/${loanDetails.loanId}/step`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ step: nextStep })
        });
      } catch (err) {
        console.error("Failed to save step progress", err);
      }
    }
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage
          onApply={handleApplicationComplete}
          onCheckStatus={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'dashboard' && (
        <div className="dashboard-view">
          {/* Header check for user context if needed, or simple wrapper */}

          {/* Step 2: Documents */}
          {applicationStep === 2 && (
            <DocumentUpload
              loanId={loanDetails?.loanId}
              onComplete={handleTaskComplete}
              onBack={() => setCurrentView('landing')}
            />
          )}

          {/* Step 3: NACH */}
          {applicationStep === 3 && (
            <NachSetup
              onComplete={handleTaskComplete}
              onBack={() => setCurrentView('landing')}
            />
          )}

          {/* Step 4: Agreement */}
          {applicationStep === 4 && (
            <LoanAgreement
              onComplete={handleTaskComplete}
              onBack={() => setCurrentView('landing')}
            />
          )}
        </div>
      )}

      {currentView === 'dashboard' && applicationStep === 5 && (
        <div className="dashboard-view container">
          <header className="hero-success" style={{ padding: '60px', background: '#e0f2f2', borderRadius: '30px', textAlign: 'center', marginTop: '40px' }}>
            <h1 style={{ color: '#008080' }}>Disbursal In Progress! 🚀</h1>
            <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
              We are transferring ₹{loanOffer?.toLocaleString()} to your bank account.
            </p>
            <p style={{ color: '#666' }}>Usually takes 2-4 hours.</p>
            <button className="btn-kar" style={{ marginTop: '30px', width: 'auto', minWidth: '240px' }} onClick={() => { setCurrentView('landing'); setUser(null); }}>
              Back to Home
            </button>
          </header>
        </div>
      )}

      <style>{`
        .dashboard-view {
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 40px;
        }
        /* ... Helper styles ... */
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
