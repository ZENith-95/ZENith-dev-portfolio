import { compare, hash } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminUsername || !adminPassword) {
  console.warn("ADMIN_USERNAME or ADMIN_PASSWORD not set. Admin login will fail.");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        if (!adminUsername || !adminPassword) {
          return null;
        }

        const usernameMatches = credentials.username === adminUsername;
        const passwordMatches = await compare(credentials.password, await getAdminPasswordHash());

        if (usernameMatches && passwordMatches) {
          return {
            id: "admin",
            name: adminUsername,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = session.user || ({} as any);
        session.user.name = token.name ?? adminUsername ?? "Admin";
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

let cachedAdminHash: string | null = null;

async function getAdminPasswordHash() {
  if (!adminPassword) return "";
  if (!cachedAdminHash) {
    cachedAdminHash = await hash(adminPassword, 10);
  }
  return cachedAdminHash;
}
