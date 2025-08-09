import { eq, and, count } from 'drizzle-orm';
import { db } from '../db';
import { userPublicKeys } from '../db/schema/schema';

export async function publicKeyNameIsUsedByUser(name: string, userId: string): Promise<boolean> {
	const res = await db
		.select({ count: count() })
		.from(userPublicKeys)
		.where(and(eq(userPublicKeys.name, name), eq(userPublicKeys.userId, userId)));

	return res[0].count > 0;
}

export async function publicKeyExists(publicKey: string): Promise<boolean> {
	const res = await db
		.select({ count: count() })
		.from(userPublicKeys)
		.where(eq(userPublicKeys.publicKey, publicKey));

	return res[0].count > 0;
}

export function getUserPublicKeys(userId: string) {
	return db.select().from(userPublicKeys).where(eq(userPublicKeys.userId, userId));
}

export function saveUserPublicKey(publicKey: string, name: string, userId: string) {
	return db.insert(userPublicKeys).values({ publicKey, name, userId });
}
