import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from './Icon';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Icon name="close" size={32} color={THEME.colors.primaryContainer} />
            </View>

            <Text style={styles.title}>عذراً، حدث خطأ غير متوقع</Text>
            <Text style={styles.subtitle}>
              واجه التطبيق مشكلة أثناء معالجة الشاشة. يمكنك المحاولة مرة أخرى أو إعادة تشغيل التطبيق.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <View style={styles.devContainer}>
                <TouchableOpacity
                  style={styles.detailsToggle}
                  onPress={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                >
                  <Text style={styles.detailsToggleText}>
                    {this.state.showDetails ? '▲ إخفاء تفاصيل الخطأ (Dev)' : '▼ تفاصيل الخطأ التقني (Dev)'}
                  </Text>
                </TouchableOpacity>

                {this.state.showDetails && (
                  <ScrollView style={styles.debugScroll} nestedScrollEnabled>
                    <Text style={styles.errorName}>
                      {this.state.error.name}: {this.state.error.message}
                    </Text>
                    {this.state.errorInfo?.componentStack && (
                      <Text style={styles.stackText}>
                        {this.state.errorInfo.componentStack}
                      </Text>
                    )}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderWidth: 1.5,
    borderColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: THEME.colors.onSurface,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 320,
  },
  retryButton: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  devContainer: {
    marginTop: 24,
    width: '100%',
    maxHeight: 240,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  detailsToggle: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  detailsToggleText: {
    color: THEME.colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  debugScroll: {
    backgroundColor: '#05070A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorName: {
    color: '#FF6B6B',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  stackText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});
