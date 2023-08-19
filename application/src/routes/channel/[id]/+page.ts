import { JWT_COOKIE_KEY, getCookie } from "$lib/common";

export async function load({ params }) {
	const channelId = params.id;
	const channelData = (await (await fetch(`/api/channels/${channelId}/detail`, {
		headers: {
			Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`
		}
	})).json());
	return { channelData: channelData };
}