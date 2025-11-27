interface PasswordRequirement {
  re: RegExp;
  label: string;
}

export const requirements: PasswordRequirement[] = [
  { re: /.{8,}/, label: 'At least 8 characters' },
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export function getStrength(password: string): number {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  const strength = getStrength(password);
  if (strength < 100) {
    const unmetRequirements = requirements
      .filter((req) => !req.re.test(password))
      .map((req) => req.label);

    if (unmetRequirements.length > 0) {
      return `Password must meet all requirements`;
    }
  }

  return null;
}
