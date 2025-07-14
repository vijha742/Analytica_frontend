import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    githubAccessToken?: string;
    backendJWT?: string;
    refreshToken?: string;
  }
  
  interface JWT {
    githubAccessToken?: string;
    backendJWT?: string;
    refreshToken?: string;
  }

  interface User {
    backendJWT?: string;
    refreshToken?: string;
  }

  interface Profile {
    id?: string;
  }
}
