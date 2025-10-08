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
		async jwt({ token, account, user, trigger }) {
			if (account) {
				token.githubAccessToken = account.access_token;
				// Try multiple sources for the GitHub username
				token.githubUsername = account.login;
			}
			if (user?.backendJWT) {
				token.backendJWT = user.backendJWT;
			}
			if (user?.refreshToken) {
				token.refreshToken = user.refreshToken;
			}
			if (user?.githubUsername) {
				token.githubUsername = user.githubUsername;
			}
			if (user?.userTeams) {
				token.userTeams = user.userTeams;
			}

			// Check if JWT is expired and refresh if needed
			if (token.backendJWT && token.refreshToken && trigger !== "signIn") {
				try {
					// Basic JWT expiration check (decode without verification)
					const jwtString = token.backendJWT as string;
					const [, payload] = jwtString.split('.');
					const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
					const now = Math.floor(Date.now() / 1000);

					// If JWT expires in less than 5 minutes, refresh it
					if (decodedPayload.exp && decodedPayload.exp - now < 300) {
						const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-jwt`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Cookie': `refreshToken=${token.refreshToken as string}`
							}
						});

						if (refreshResponse.ok) {
							const refreshData = await refreshResponse.json();
							if (refreshData.jwtToken) {
								token.backendJWT = refreshData.jwtToken;
							}
							if (refreshData.refreshToken) {
								token.refreshToken = refreshData.refreshToken;
							}
						}
					}
				} catch (error) {
					console.error('Error refreshing JWT in NextAuth callback:', error);
				}
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
			session.githubUsername = token.githubUsername as string;
			if (token.userTeams) {
				session.userTeams = token.userTeams as string[];
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
						console.log('Backend response data:', {
							hasJWT: !!backendData.jwtToken,
							hasRefresh: !!backendData.refreshToken,
							githubUsername: backendData.githubUsername,
							hasUserData: !!backendData.userData,
							teams: backendData.userData?.teams
						});

						user.backendJWT = backendData.jwtToken;
						user.refreshToken = backendData.refreshToken;
						user.githubUsername = backendData.githubUsername;
						// Extract teams from userData
						if (backendData.userData && backendData.userData.teams) {
							user.userTeams = backendData.userData.teams;
							console.log('Stored user teams:', user.userTeams);
						}
						return true;
					} else {
						console.error('Backend authentication failed:', backendResponse.status, await backendResponse.text());
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
		strategy: "jwt",
		maxAge: 24 * 60 * 60, // 24 hours (matches your backend JWT expiration)
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		error: "/auth/error",
		verifyRequest: "/auth/verify-request",
	},
	secret: process.env.NEXTAUTH_SECRET
}
