// utils/security.ts
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 7) {
        return { valid: false, error: 'Mínimo 7 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Al menos una mayúscula' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, error: 'Al menos un carácter especial' };
    }
    return { valid: true };
};

export const hasSQLInjection = (input: string): boolean => {
    const sqlPatterns = [
        /(\bSELECT\b.*\bFROM\b)/i,
        /(\bINSERT\b.*\bINTO\b)/i,
        /(\bUPDATE\b.*\bSET\b)/i,
        /(\bDELETE\b.*\bFROM\b)/i,
        /(\bDROP\b.*\bTABLE\b)/i,
        /(--)/,
        /(;)/,
        /('.*OR.*'.*=.*')/i
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
};