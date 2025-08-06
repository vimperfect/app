import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './db/schema/auth';
import { GITHUB_CLIENT_SECRET, GITHUB_CLIENT_ID, BETTER_AUTH_SECRET } from '$env/static/private';

export const auth = betterAuth({
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: schema,
		usePlural: true
	}),
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID as string,
			clientSecret: GITHUB_CLIENT_SECRET as string,
			mapProfileToUser: (profile) => {
				return {
					username: profile.login
				};
			}
		}
	},
	user: {
		additionalFields: {
			username: {
				type: 'string',
				required: true,
				input: false
			}
		}
	}
});
