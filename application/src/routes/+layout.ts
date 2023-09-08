import { BaseUrl, JWT_DB_KEY, JWT_OAUTH_KEY, hasCookie } from '$lib/common';
import { getRequestApi } from '$lib/fetch';
import {
	blockeeStore,
	channelUserInStore,
	directUserInStore,
	followeeStore,
	userIdStore,
} from '$lib/store';
import type {
	Blockee,
	Followee,
	LeftSideBarChannel,
	LeftSideBarDirect,
} from '$lib/type';
import { goto } from '$app/navigation';

export const ssr = false;

export async function load({ url }) {
	let channels: LeftSideBarChannel[];
	let directs: LeftSideBarDirect[];
	let followees: Followee[];
	let blockees: Blockee[];
	let userId: number;
	let register = true;

	if (hasCookie(JWT_DB_KEY)) {
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
		blockees = await getRequestApi(BaseUrl.BLOCKED);
		followees = await getRequestApi(BaseUrl.FOLLOWS);
		userId = (await getRequestApi(BaseUrl.USERS + 'oneself')).id;
		console.log(followees);
	} else {
		//TODO: JWT 쿠키가 없다면 사이드바, 상단바를 감추고 로그인하도록 구현
		channels = [];
		directs = [];
		blockees = [];
		followees = [];
		userId = -1;
		register = false;
		if (!hasCookie(JWT_OAUTH_KEY) && url.pathname !== '/login')
			goto('/login');
		if (hasCookie(JWT_OAUTH_KEY) && url.pathname !== '/signup')
			goto('/signup');
	}
	channelUserInStore.set(channels);
	directUserInStore.set(directs);
	blockeeStore.set(blockees.map((each) => each.blockee));
	followeeStore.set(followees.map((each) => each.followee));
	userIdStore.set(userId);
	return {
		chat: [
			{ title: 'Channel', list: channels },
			{ title: 'DM', list: directs },
			{ title: 'Follow', list: followees },
		],
		game: {},
		register: register,
	};
}
