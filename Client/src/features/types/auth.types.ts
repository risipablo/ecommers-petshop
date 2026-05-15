// features/types/auth.types.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ChangeNameCredentials {
    name: string;
}

export interface ChangePasswordCredentials {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ForgotPasswordCredentials {
    email: string;
}

export interface ResetPasswordCredentials {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    changeName: (credentials: ChangeNameCredentials) => Promise<void>;
    changePassword: (credentials: ChangePasswordCredentials) => Promise<void>;
    forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<void>;
    resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
    isAdmin: boolean;
}