import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('EcoAlert crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#07070a', color: '#f4f4f5', fontFamily: 'Inter, sans-serif',
          padding: '24px', textAlign: 'center', gap: '16px'
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ color: '#ef4444', margin: 0 }}>App Crashed</h2>
          <pre style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', padding: '16px', maxWidth: '600px',
            fontSize: '0.8rem', color: '#fca5a5', whiteSpace: 'pre-wrap',
            wordBreak: 'break-all', textAlign: 'left'
          }}>
            {String(this.state.error)}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{
              padding: '10px 24px', background: '#22c55e', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            Clear Data & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
