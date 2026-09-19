import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Zenith Apparel & Footwear Clothing House application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#fafaf9',
          color: '#1c1917',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#881337', marginBottom: '8px' }}>
            Zenith Apparel & Footwear — Shalina
          </h1>
          <p style={{ color: '#57534e', marginBottom: '16px', maxWidth: '480px', fontSize: '14px' }}>
            The application encountered a temporary issue while loading. Please refresh or reset to the homepage.
          </p>
          {this.state.error?.message && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
              marginBottom: '16px',
              maxWidth: '90vw',
              overflowX: 'auto'
            }}>
              {this.state.error.message}
            </div>
          )}
          <button
            onClick={() => {
              window.location.hash = '#/';
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#881337',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Reload Storefront
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  }
} catch (mountError) {
  console.error('Fatal initialization error:', mountError);
  const splash = document.getElementById('Zenith Apparel & Footwear-initial-splash');
  if (splash) {
    const errorNotice = document.getElementById('Zenith Apparel & Footwear-splash-error');
    if (errorNotice) errorNotice.style.display = 'block';
  }
}

