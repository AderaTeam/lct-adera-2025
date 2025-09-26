import { Component, ReactNode } from 'react';
import { ShowAfter } from './_internal/ShowAfter';
import { isAuthError } from './isAuthError';

export interface ErrorBoundaryProps {
  errorElement: (errorElementArgs: { error: unknown; clearError: () => void }) => ReactNode | null;
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  hasAuthError: boolean;
  error: unknown;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, hasAuthError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    // превращает AderaError в Error, когда они выбрасываются внутри authLink
    return { hasError: true, hasAuthError: error instanceof Error && isAuthError(error), error };
  }

  componentDidCatch(error: unknown) {
    if (!this.state.hasAuthError) {
      console.error('errorBoundary catch', error);
    }
  }

  componentDidUpdate() {
    // сбрасывает auth-ошибку после выхода из системы
    if (this.state.hasAuthError) this.clearError();
  }

  clearError = () => {
    this.setState({ hasError: false, hasAuthError: false, error: null });
  };

  render() {
    if (this.state.hasAuthError) {
      return (
        <ShowAfter delay={2000}>
          <p style={{ display: 'block', margin: 12, lineHeight: 1, opacity: 0.75 }}>
            Ожидание выхода из система в связи с ошибкой авторизации...
          </p>
        </ShowAfter>
      );
    } else if (this.state.hasError) {
      return this.props.errorElement({ error: this.state.error, clearError: this.clearError });
    } else {
      return this.props.children;
    }
  }
}
