import {
	BaseUrl,
	channelContentDateReviver,
} from '$lib/common';
import { getRequestApi } from '$lib/fetch.js';

export async function load({ params }) {
	const channelData = await getRequestApi(
		BaseUrl.CHANNELS + `${params.id}/detail`,
	);
	return {
		channelData: JSON.parse(
			JSON.stringify(channelData),
			channelContentDateReviver,
		),
	};
}
