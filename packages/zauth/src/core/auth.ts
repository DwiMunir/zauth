import bcrypt from "bcryptjs";

export function createAuthService(prisma: any) {
  return {
    async verifyCredentials(email: string, password: string) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error("Invalid credentials");

      return user;
    },

    async register(email: string, password: string) {
      const hashed = await bcrypt.hash(password, 10);
      return prisma.user.create({
        data: { email, password: hashed },
      });
    },
  };
}
