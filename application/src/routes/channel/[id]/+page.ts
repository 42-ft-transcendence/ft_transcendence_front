import { goto } from '$app/navigation';
import {
	BaseUrl,
	channelContentDateReviver,
	printOrRethrow,
} from '$lib/common';
import { getRequestApi } from '$lib/fetch.js';

export async function load({ params }) {
	try {
		const channelData = await getRequestApi(
			BaseUrl.CHANNELS + `${params.id}/detail`,
		);
		return {
			channelData: JSON.parse(
				JSON.stringify(channelData),
				channelContentDateReviver,
			),
		};
	} catch (err: any) {
		await goto('/', { replaceState: true });
		printOrRethrow(err);
	}
}
