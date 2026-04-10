import * as React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border-4 border-red-100 dark:border-red-900/30 text-center"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="marker-font text-3xl text-slate-800 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
              The Lab encountered an unexpected error. Don't worry, your progress is safe!
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8 text-left overflow-hidden">
              <p className="text-[10px] font-mono text-red-400 break-all">
                {this.state.error?.message}
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_4px_0_#1e40af] active:translate-y-1 active:shadow-none"
            >
              <RefreshCcw className="w-5 h-5" />
              RESTART LAB
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
