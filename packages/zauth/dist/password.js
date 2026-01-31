// Password management with hashing and verification
import { randomBytes, scrypt } from 'crypto';
export class PasswordManager {
    constructor() {
        this.defaultOptions = {
            saltLength: 16,
            keyLength: 64,
            iterations: 100000
        };
    }
    async hash(password, options) {
        const opts = { ...this.defaultOptions, ...options };
        const salt = randomBytes(opts.saltLength);
        const derivedKey = await new Promise((resolve, reject) => {
            scrypt(password, salt, opts.keyLength, { N: opts.iterations }, (err, derivedKey) => {
                if (err)
                    reject(err);
                else
                    resolve(derivedKey);
            });
        });
        // Combine salt and derived key
        const combined = Buffer.concat([salt, derivedKey]);
        // Convert to base64 for storage
        return combined.toString('base64');
    }
    async verify(password, hash) {
        try {
            const combined = Buffer.from(hash, 'base64');
            // Extract salt and derived key
            const salt = combined.slice(0, this.defaultOptions.saltLength);
            const storedKey = combined.slice(this.defaultOptions.saltLength);
            // Derive key from provided password
            const derivedKey = await new Promise((resolve, reject) => {
                scrypt(password, salt, this.defaultOptions.keyLength, { N: this.defaultOptions.iterations }, (err, derivedKey) => {
                    if (err)
                        reject(err);
                    else
                        resolve(derivedKey);
                });
            });
            // Compare keys using constant-time comparison
            return this.timingSafeEqual(derivedKey, storedKey);
        }
        catch (error) {
            return false;
        }
    }
    async generateResetToken() {
        return randomBytes(32).toString('hex');
    }
    async generateApiKey() {
        const prefix = 'zauth_';
        const randomPart = randomBytes(24).toString('hex');
        return `${prefix}${randomPart}`;
    }
    validatePasswordStrength(password) {
        const feedback = [];
        let score = 0;
        // Length check
        if (password.length >= 8) {
            score += 1;
        }
        else {
            feedback.push('Password should be at least 8 characters long');
        }
        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain at least one uppercase letter');
        }
        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain at least one lowercase letter');
        }
        // Number check
        if (/[0-9]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain at least one number');
        }
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }
        else {
            feedback.push('Password should contain at least one special character');
        }
        return {
            isValid: score >= 4,
            score,
            feedback
        };
    }
    timingSafeEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a[i] ^ b[i];
        }
        return result === 0;
    }
}
//# sourceMappingURL=password.js.map