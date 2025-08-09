import { isValidOpenSSHPublicKey } from '$lib/util/ssh';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ErrorCodes, VimperfectError } from '$lib/errors';
import { addUserPublicKey, userHasPublicKey } from '$lib/server/service/user';

const DEFAULT_KEY_NAME = 'Default';

export async function load({ locals }) {
	return { hasPublicKeys: await userHasPublicKey(locals.session.user.id) };
}

function checkPublicKey(publicKey: string) {
	if (!publicKey || !isValidOpenSSHPublicKey(publicKey)) {
		throw new VimperfectError(ErrorCodes.InvalidPublicKey);
	}
}

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const publicKey = ((data.get('public_key') as string) ?? '').trim();

		try {
			checkPublicKey(publicKey);
			await addUserPublicKey(locals.session.user.id, publicKey, DEFAULT_KEY_NAME);

			return { publicKeySaved: true };
		} catch (e) {
			if (e instanceof VimperfectError) {
				return fail(400, e.toSvelteKitError());
			}
			throw e;
		}
	}
} satisfies Actions;
