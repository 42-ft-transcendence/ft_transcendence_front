import { BaseUrl, JWT_COOKIE_KEY, hasCookie } from '$lib/common';
import { getRequestApi } from '$lib/fetch';
import { blockeeStore, channelUserInStore, directUserInStore, profileIdStore, userIdStore } from '$lib/store';
import type {
	Blockee,
	LeftSideBarChannel,
	LeftSideBarDirect,
} from '$lib/type';
import { get, readable } from 'svelte/store';

export const ssr = false;

export async function load() {
	let channels: LeftSideBarChannel[];
	let directs: LeftSideBarDirect[];
	//TODO: let friends
	let blockList: Blockee[];

	if (hasCookie(JWT_COOKIE_KEY)) {
		channels = (await getRequestApi(BaseUrl.CHANNELS + 'channelsUserIn')).map(
			(channel: any) => ({
				id: channel.id,
				name: channel.name,
				type: channel.type,
				href: `/channel/${channel.id}`,
			}),
		);
		directs = (await getRequestApi(BaseUrl.CHANNELS + 'directsUserIn')).map(
			(direct: any) => ({
				href: `/channel/${direct.channelId}`,
				channelId: direct.channelId,
				userId: direct.userId,
				userName: direct.userName,
				avatar: direct.avatar,
			}),
		);
		blockList = await getRequestApi(BaseUrl.BLOCKED);
	} else {
		//TODO: JWT 쿠키가 없다면 사이드바, 상단바를 감추고 로그인하도록 구현
		channels = [];
		directs = [];
		blockList = [];
	}
	channelUserInStore.set(channels);
	directUserInStore.set(directs);
	blockeeStore.set(blockList.map(each => each.blockee));
	userIdStore.set(get(readable((await getRequestApi(BaseUrl.USERS + 'oneself')).id)));
	return {
		chat: [
			{ title: 'Channel', list: channels },
			{ title: 'DM', list: directs },
			{ title: 'Friends', list: [] },
		],
		game: {},
	};
}
