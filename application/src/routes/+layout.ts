import { BaseUrl, JWT_DB_KEY, JWT_OAUTH_KEY, hasCookie } from '$lib/common';
import { getRequestApi } from '$lib/fetch';
import {
	blockeeStore,
	channelUserInStore,
	directUserInStore,
	followeeStore,
	twoFactorAuthStore,
	userIdStore,
} from '$lib/store';
import type {
	Blockee,
	Followee,
	LeftSideBarChannel,
	LeftSideBarDirect,
	UserProfile,
} from '$lib/type';
import { goto } from '$app/navigation';

export const ssr = false;

export async function load({ url }) {
	let channels: LeftSideBarChannel[] = [];
	let directs: LeftSideBarDirect[] = [];
	let followees: Followee[] = [];
	let blockees: Blockee[] = [];
	let userId = -1;
	let flag2FA = false;
	let register = false;

	if (hasCookie(JWT_DB_KEY)) {
		const { refresh } = await getRequestApi(BaseUrl.USERS + 'twoFactorSetting');

		if (refresh && url.pathname !== '/validate') goto('/validate');
		else {
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
			const user: UserProfile = await getRequestApi(BaseUrl.USERS + 'oneself');
			userId = user.id;
			flag2FA = user.is2FAEnabled;
			register = true;
		}
	} else {
		if (!hasCookie(JWT_OAUTH_KEY) && url.pathname !== '/login') goto('/login');
		if (hasCookie(JWT_OAUTH_KEY) && url.pathname !== '/signup') goto('/signup');
	}

	channelUserInStore.set(channels);
	directUserInStore.set(directs);
	blockeeStore.set(blockees.map((each) => each.blockee));
	followeeStore.set(followees.map((each) => each.followee));
	userIdStore.set(userId);
	twoFactorAuthStore.set(flag2FA);

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
