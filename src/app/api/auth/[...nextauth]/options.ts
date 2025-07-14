import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!
		})
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.githubAccessToken = account.access_token;
			}
			if (user?.backendJWT) {
				token.backendJWT = user.backendJWT;
			}
			if (user?.refreshToken) {
				token.refreshToken = user.refreshToken;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.githubAccessToken) {
				session.githubAccessToken = token.githubAccessToken as string;
			}
			if (token.backendJWT) {
				session.backendJWT = token.backendJWT as string;
			}
			if (token.refreshToken) {
				session.refreshToken = token.refreshToken as string;
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === "github" && account?.access_token) {
				try {
					const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							githubToken: account.access_token,
							userObject: {
								id: user.id,
								email: user.email,
								name: user.name,
								imageUrl: user.image,
								githubId: profile?.id || user.id
							}
						}),
					});

					if (backendResponse.ok) {
						const backendData = await backendResponse.json();
						user.backendJWT = backendData.jwtToken;
						user.refreshToken = backendData.refreshToken;
						return true;
					} else {
						console.error('Backend authentication failed');
						return false;
					}
				} catch (error) {
					console.error('Error during backend authentication:', error);
					return false;
				}
			}
			return true;
		}
	},
	session: {
		strategy: "jwt"
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		error: "/auth/error",
		verifyRequest: "/auth/verify-request",
	},
	secret: process.env.NEXTAUTH_SECRET
}
