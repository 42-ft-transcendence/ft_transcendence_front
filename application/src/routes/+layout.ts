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
import { get } from 'svelte/store';

export const ssr = false;

export async function load({ url }) {
	if (['/login', '/signup', '/validate'].includes(url.pathname)) return;
		
	// before inserting user data into database
	if (!hasCookie(JWT_OAUTH_KEY) && !hasCookie(JWT_DB_KEY)) await goto('/login', { replaceState: true });
	else if (hasCookie(JWT_OAUTH_KEY)) await goto('/signup', { replaceState: true });
	else {
		const { refresh } = await getRequestApi(BaseUrl.USERS + 'twoFactorSetting');
		// after insertion but not two factor authenticated
		if (refresh) await goto('/validate', { replaceState: true });
		else {
			// after insertion and two factor authenticated
			channelUserInStore.set(
				(await getRequestApi(BaseUrl.CHANNELS + 'channelsUserIn')).map(
					(channel: any) => ({ ...channel, href: `/channel/${channel.id}` }),
				),
			);
			directUserInStore.set(
				(await getRequestApi(BaseUrl.CHANNELS + 'directsUserIn')).map(
					(direct: any) => ({ ...direct, href: `/channel/${direct.channelId}` }),
				),
			);
			blockeeStore.set(
				(await getRequestApi(BaseUrl.BLOCKED)).map((each: Blockee) => each.blockee),
			);
			followeeStore.set(
				(await getRequestApi(BaseUrl.FOLLOWS)).map(
					(each: Followee) => each.followee,
				),
			);
	
			const user: UserProfile = await getRequestApi(BaseUrl.USERS + 'oneself');
			userIdStore.set(user.id);
			twoFactorAuthStore.set(user.is2FAEnabled);
	
			return generateReturnValueFallBack(
				get(channelUserInStore),
				get(directUserInStore),
				get(followeeStore),
				true,
			);
		}
	}
}

function generateReturnValueFallBack(
	channels: LeftSideBarChannel[],
	directs: LeftSideBarDirect[],
	followees: UserProfile[],
	authenticated: boolean,
) {
	return {
		chat: [
			{ title: 'Channel', list: channels },
			{ title: 'DM', list: directs },
			{ title: 'Follow', list: followees },
		],
		game: {},
		authenticated: authenticated,
	};
}
