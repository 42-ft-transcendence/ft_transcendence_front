import { JWT_COOKIE_KEY, channelContentDateReviver, getCookie } from "$lib/common";

export async function load({ params }) {
	const channelId = params.id;
	const response = await fetch(`/api/channels/${channelId}/detail`, {
		headers: { Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}` }
	});
	const responseJson = await response.json();
	const channelData = JSON.parse(JSON.stringify(responseJson), channelContentDateReviver);
	return { channelData: channelData };
}