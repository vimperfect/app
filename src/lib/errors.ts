export enum ErrorCodes {
	InvalidPublicKey = 'invalid_public_key',
	PublicKeyAlreadyUsed = 'public_key_already_used',
	YouAlreadyUsedThisPublicKeyName = 'used_public_key_name'
}

export class VimperfectError extends Error {
	code: ErrorCodes;

	constructor(code: ErrorCodes) {
		super(code);
		this.code = code;
	}

	public toSvelteKitError() {
		return {
			error: true,
			code: this.code
		};
	}
}
