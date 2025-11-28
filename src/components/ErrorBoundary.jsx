// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-day-bg dark:bg-night-bg text-day-text dark:text-night-text">
          <div className="p-4 bg-red-500/10 rounded-full mb-4 text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            The video player encountered an error. This usually happens due to missing files or a rendering glitch.
          </p>
          <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-lg text-left text-xs font-mono text-red-500 w-full max-w-2xl overflow-auto mb-6 border border-red-500/20">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold shadow-lg"
          >
            <RefreshCw size={18} /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;