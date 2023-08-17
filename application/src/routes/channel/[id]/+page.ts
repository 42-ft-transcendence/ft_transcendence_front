import { getCookie } from "$lib/common";

export async function load({ params }) {
    const channelId = params.id;
    const channelData = (await (await fetch(`/api/channels/${channelId}/detail`, {
        headers: {
            'Authorization': `Bearer ${getCookie('JsonWebToken')}`
        }
    })).json());
    return { channelData: channelData };
}