export interface PasswordHashOptions {
    saltLength?: number;
    keyLength?: number;
    iterations?: number;
}
export declare class PasswordManager {
    private defaultOptions;
    hash(password: string, options?: PasswordHashOptions): Promise<string>;
    verify(password: string, hash: string): Promise<boolean>;
    generateResetToken(): Promise<string>;
    generateApiKey(): Promise<string>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        score: number;
        feedback: string[];
    };
    private timingSafeEqual;
}
//# sourceMappingURL=password.d.ts.map