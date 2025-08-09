const dssRegex = /^ssh-dss AAAAB3NzaC1kc3[0-9A-Za-z+/]+[=]{0,3}$/;
const ecdsaRegex = /^ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNT[0-9A-Za-z+/]+[=]{0,3}$/;
const nistp256Regex =
	/^sk-ecdsa-sha2-nistp256@openssh.com AAAAInNrLWVjZHNhLXNoYTItbmlzdHAyNTZAb3BlbnNzaC5jb2[0-9A-Za-z+/]+[=]{0,3}$/;
const ed25519Regex = /^ssh-ed25519 AAAAC3NzaC1lZDI1NTE5[0-9A-Za-z+/]+[=]{0,3}$/;
const skRegex =
	/^sk-ssh-ed25519@openssh.com AAAAGnNrLXNzaC1lZDI1NTE5QG9wZW5zc2guY29t[0-9A-Za-z+/]+[=]{0,3}$/;
const rsaRegex = /^ssh-rsa AAAAB3NzaC1yc2[0-9A-Za-z+/]+[=]{0,3}$/;

/**
 * Validates if the given public key is a valid OpenSSH public key.
 * Important: keys must not have a comment at the end.
 */
export function isValidOpenSSHPublicKey(publicKey: string) {
	return (
		dssRegex.test(publicKey) ||
		ecdsaRegex.test(publicKey) ||
		nistp256Regex.test(publicKey) ||
		ed25519Regex.test(publicKey) ||
		skRegex.test(publicKey) ||
		rsaRegex.test(publicKey)
	);
}

/**
 * Strips optional comment from the given public key.
 */
export function stripOpenSSHPublicKeyComment(publicKey: string) {
	return publicKey.trim().split(/\s+/).slice(0, 2).join(' ');
}
