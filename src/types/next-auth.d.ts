import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      bio?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
  }
}
