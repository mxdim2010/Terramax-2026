import NextAuth from "next-auth"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        })

        if (!user?.passwordHash || !user.emailVerified) {
          return null
        }

        const isValidPassword = await verifyPassword(parsed.data.password, user.passwordHash)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.sub = user.id
        token.role = (user as { role?: string }).role ?? "CUSTOMER"
      }

      return token
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = typeof token.role === "string" ? token.role : "CUSTOMER"
      }

      return session
    },
  },
})