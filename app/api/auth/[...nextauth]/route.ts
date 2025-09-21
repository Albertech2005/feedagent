import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Save user email to use with your projects
      return session
    },
    async signIn({ user, account, profile }) {
      // User successfully signed in with Google
      // You can save their info here if needed
      return true
    }
  }
})

export { handler as GET, handler as POST }