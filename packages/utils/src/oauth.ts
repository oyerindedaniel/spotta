interface ValidationResult {
  isValid: boolean;
  redirectUrl: string | null;
}

interface StateValidator {
  create: (redirectUrl: string) => string;
  validate: (responseState: string) => ValidationResult;
}

export function generateAndValidateState(): StateValidator {
  function createState(redirectUrl: string) {
    const nonce = Math.random().toString(36).substring(2);
    const storedData = { redirectUrl };
    localStorage.setItem(nonce, JSON.stringify(storedData));
    return nonce;
  }

  function validateState(responseState: string): ValidationResult {
    const storedDataString = localStorage.getItem(responseState);

    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);

      if (storedData.redirectUrl) {
        return { isValid: true, redirectUrl: storedData.redirectUrl };
      }
    }

    return { isValid: false, redirectUrl: null };
  }

  return {
    create: createState,
    validate: validateState,
  };
}
