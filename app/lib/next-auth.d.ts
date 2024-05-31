import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
      } & DefaultSession["user"];
    }
    interface User {
        id: string;
      }
  }
