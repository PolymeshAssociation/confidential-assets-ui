import {
  Alert,
  Button,
  Code,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary to catch and display WASM initialization or runtime errors
 */
export class WasmErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('WASM Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isBrowserSupported = typeof WebAssembly === 'object';

      return (
        <Container size="sm" py="xl">
          <Stack gap="lg">
            <Alert
              icon={<IconAlertCircle size={24} />}
              title="WASM Module Error"
              color="red"
              variant="filled"
            >
              The DART WASM module failed to load or encountered an error.
            </Alert>

            <div>
              <Title order={3} mb="sm">
                What went wrong?
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                {this.state.error?.message || 'An unknown error occurred'}
              </Text>
              {this.state.error?.stack && (
                <Code
                  block
                  style={{
                    fontSize: '0.75rem',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.stack}
                </Code>
              )}
            </div>

            <div>
              <Title order={3} mb="sm">
                Browser Compatibility
              </Title>
              <Text size="sm">
                WebAssembly Support: {isBrowserSupported ? '✅ Yes' : '❌ No'}
              </Text>
              {!isBrowserSupported && (
                <Text size="sm" c="red" mt="xs">
                  Your browser does not support WebAssembly. Please use a modern
                  browser like Chrome, Firefox, Safari, or Edge.
                </Text>
              )}
            </div>

            <div>
              <Title order={3} mb="sm">
                Possible Solutions
              </Title>
              <Stack gap="xs">
                <Text size="sm">• Try reloading the page</Text>
                <Text size="sm">• Clear your browser cache and cookies</Text>
                <Text size="sm">
                  • Update your browser to the latest version
                </Text>
                <Text size="sm">• Try using a different browser</Text>
                <Text size="sm">• Check your internet connection</Text>
              </Stack>
            </div>

            <Button onClick={this.handleReload} size="md">
              Reload Page
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
