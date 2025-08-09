import { ErrorCodes, VimperfectError } from '$lib/errors';
import {
	publicKeyNameIsUsedByUser,
	publicKeyExists,
	saveUserPublicKey,
	getUserPublicKeys
} from '../repo/public-keys';

export async function addUserPublicKey(userId: string, publicKey: string, name: string) {
	if (await publicKeyExists(publicKey)) {
		throw new VimperfectError(ErrorCodes.PublicKeyAlreadyUsed);
	}

	if (await publicKeyNameIsUsedByUser(name, userId)) {
		throw new VimperfectError(ErrorCodes.YouAlreadyUsedThisPublicKeyName);
	}

	await saveUserPublicKey(publicKey, name, userId);
}

export async function userHasPublicKey(userId: string) {
	const keys = await getUserPublicKeys(userId);
	return keys.length > 0;
}
