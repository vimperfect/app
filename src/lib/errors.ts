import { fail, type ActionFailure } from '@sveltejs/kit';

export enum ErrorCodes {
	/** The provided public key is invalid */
	InvalidPublicKey = 'invalid_public_key',

	/** The provided public key is already used in the system */
	PublicKeyAlreadyUsed = 'public_key_already_used',

	/** The user already has a public key with the provided name */
	YouAlreadyUsedThisPublicKeyName = 'used_public_key_name'
}

/** Generic error class for user facing errors */
export class VimperfectError extends Error {
	code: ErrorCodes;

	constructor(code: ErrorCodes) {
		super(code);
		this.code = code;
	}

	public toActionFailure(code: number): ActionFailure<{ error: true; code: ErrorCodes }> {
		return fail(code, {
			error: true,
			code: this.code
		});
	}
}
