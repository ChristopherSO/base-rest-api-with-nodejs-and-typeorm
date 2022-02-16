export function firstCharToLowerCase(text) {
	return text.charAt(0).toLowerCase() + text.slice(1);
}

export type Response<T> = [T] | [null, Error]

export async function responseHelper<T>(promise: Promise<T>): Promise<Response<T>> {
	try {
		return [await promise];
	} catch (error) {
		return [null, error];
	}
}
