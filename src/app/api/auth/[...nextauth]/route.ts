import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  allowDangerousEmailAccountLinking: true,
})

const handler = NextAuth({
  providers: [
    googleProvider
  ]
})

export { handler as GET, handler as POST }