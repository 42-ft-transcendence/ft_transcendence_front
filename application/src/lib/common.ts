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

export const channelIcon: { [index: string]: string; } = {
	PUBLIC: "fa fa-users",
	PRIVATE: "fa fa-user-secret",
	PROTECTED: "fa fa-lock fa-lg"
};