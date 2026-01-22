import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import connectDB from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github' && profile) {
        try {
          await connectDB();

          const githubProfile = profile as {
            login: string;
            name?: string;
            email?: string;
            avatar_url?: string;
            bio?: string;
          };

          const existingUser = await User.findOne({ githubId: account.providerAccountId });

          if (!existingUser) {
            await User.create({
              githubId: account.providerAccountId,
              username: githubProfile.login.toLowerCase(),
              name: githubProfile.name || githubProfile.login,
              email: user.email || `${githubProfile.login}@github.local`,
              avatar: user.image || githubProfile.avatar_url || '',
              bio: githubProfile.bio || '',
            });
          } else {
            await User.findByIdAndUpdate(existingUser._id, {
              name: githubProfile.name || existingUser.name,
              avatar: user.image || githubProfile.avatar_url || existingUser.avatar,
            });
          }
        } catch (error) {
          console.error('Error during sign in:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            provider: account?.provider,
            userId: user?.id,
          });
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ githubId: token.sub });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.username = dbUser.username;
            session.user.bio = dbUser.bio;
          }
        } catch (error) {
          console.error('Error fetching user in session:', {
            error: error instanceof Error ? error.message : error,
            tokenSub: token.sub,
          });
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};
