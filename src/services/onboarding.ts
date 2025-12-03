/**
 * Onboarding Service
 *
 * Handles interaction with the onboarding backend to request DID and test tokens.
 */

export interface OnboardResponse {
  success: boolean;
  did: string;
  targetAccount: string;
  polyxAmount: string;
  error?: string;
}

const ONBOARDING_URL =
  import.meta.env.VITE_ONBOARDING_URL ||
  'https://urjfdjjfff.devnet-onboard.polymesh.dev';

export async function onboardAccount(
  targetAccount: string,
): Promise<OnboardResponse> {
  try {
    const response = await fetch(ONBOARDING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetAccount }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Try to parse JSON error if possible
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          errorJson.error || errorJson.message || 'Onboarding failed',
        );
      } catch {
        // If not JSON, use text or status text
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a minute.');
        }
        throw new Error(
          `Onboarding failed: ${errorText || response.statusText}`,
        );
      }
    }

    const data = await response.json();
    return data as OnboardResponse;
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}
