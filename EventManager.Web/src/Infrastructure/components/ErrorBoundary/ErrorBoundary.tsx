import { Component } from 'react';

import { Modal } from '~Infrastructure/components/Modal/Modal';

import { type WithRouterProps, withRouter } from './RouterWrapper';

import './ErrorBoundary.css';

interface WithRouterState {
  hasError: boolean;
  error: unknown;
}

// Error boundaries do not catch errors for:
// - Event handlers
// - Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
// - Server-side rendering
// - Errors thrown in the error boundary itself (rather than its children)
class ErrorBoundaryImpl extends Component<WithRouterProps, WithRouterState> {
  constructor(props: WithRouterProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  navigateHome = () => {
    this.setState({ hasError: false, error: undefined });

    const { router } = this.props;
    router.navigate('/');
  };

  refreshPage = () => {
    this.setState({ hasError: false, error: undefined });

    const { router } = this.props;
    router.navigate(0);
  };

  // clearError = () => {
  //   this.setState({ hasError: false, error: undefined });
  //   const { router } = this.props;
  //   router.navigate('/');
  // };

  render() {
    const { error, hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Modal ariaLabel="Error">
          <div className="error-boundary-wrapper mx-2">
            <div className="card">
              <h2 className="card-header">Грешка</h2>
              <div className="card-body">
                {error instanceof Error ? (
                  <div>
                    <div>JS error: {error.message}</div>
                    <div style={{ wordBreak: 'break-word' }}>{error.stack}</div>
                  </div>
                ) : (
                  <div>Грешка в системата. Моля, опитайте по-късно</div>
                )}
              </div>
              <div className="card-footer d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-warning w-100"
                  onClick={this.refreshPage}
                >
                  Презареди
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={this.navigateHome}
                >
                  Към началната страница
                </button>
              </div>
            </div>
          </div>
        </Modal>
      );
    }

    return children;
  }
}

const ErrorBoundary = withRouter(ErrorBoundaryImpl);

export { ErrorBoundary };
