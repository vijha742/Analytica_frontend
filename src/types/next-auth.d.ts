// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    githubAccessToken?: string;
    backendJWT?: string;
    refreshToken?: string;
    githubUsername?: string;
    userTeams?: string[];
  }

  interface JWT {
    githubAccessToken?: string;
    backendJWT?: string;
    refreshToken?: string;
    githubUsername?: string;
    userTeams?: string[];
  }

  interface User {
    backendJWT?: string;
    refreshToken?: string;
    githubUsername?: string;
    userTeams?: string[];
  }

  interface Profile {
    id?: string;
    login?: string;
  }
}
