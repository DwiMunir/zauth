import bcrypt from "bcryptjs";
export function createAuthService(prisma) {
    return {
        async verifyCredentials(email, password) {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error("Invalid credentials");
            const ok = await bcrypt.compare(password, user.password);
            if (!ok)
                throw new Error("Invalid credentials");
            return user;
        },
        async register(email, password) {
            const hashed = await bcrypt.hash(password, 10);
            return prisma.user.create({
                data: { email, password: hashed },
            });
        },
    };
}
//# sourceMappingURL=auth.js.map