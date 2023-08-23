export const JWT_COOKIE_KEY = 'JsonWebToken';

export function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		const part = parts.pop();
		if (part) return part.split(';').shift();
	}
}
export function hasCookie(name: string) {
	return document.cookie.includes(name);
}

export function channelDateReviver(key: string, value: any) {
	if (key === 'createdAt' || key === 'updatedAt')
		return new Date(value);
	return value;
}

export function channelContentDateReviver(key: string, value: any) {
	if (key === 'createdAt' || key === 'updatedAt')
		return new Date(value);
	if (key === 'messages') {
		value = value.map((each: any) => {
			const { createdAt, ...others } = each;
			return { ...others, createdAt: new Date(createdAt) };
		});
	}
	return value;
}
export const channelIcon: { [index: string]: string; } = {
	PUBLIC: "fa fa-users",
	PRIVATE: "fa fa-user-secret",
	PROTECTED: "fa fa-lock fa-lg"
};