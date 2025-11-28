import { Alert, Button, Container, Stack, Text, Title } from '@mantine/core';
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
 * Error boundary to catch and display critical application errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Stack gap="lg">
            <Alert
              icon={<IconAlertCircle size={24} />}
              title="Application Error"
              color="red"
              variant="filled"
            >
              Something went wrong while loading the application.
            </Alert>

            <div>
              <Title order={3} mb="sm">
                Error Details
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                {this.state.error?.message || 'An unexpected error occurred'}
              </Text>
            </div>

            <div>
              <Title order={3} mb="sm">
                What you can try
              </Title>
              <Stack gap="xs">
                <Text size="sm">• Reload the page</Text>
                <Text size="sm">• Check your internet connection</Text>
              </Stack>
            </div>

            <div>
              <Title order={3} mb="sm">
                Still having issues?
              </Title>
              <Text size="sm" mb="xs">
                If the problem persists, please report it to the Polymesh team
                with the error details above.
              </Text>
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
