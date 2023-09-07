import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { deleteRequestApi, postRequestApi } from './fetch';
import {
	activateProfile,
	addBlockee,
	addFollowee,
	blockeeStore,
	removeBlockee,
	removeDirect,
	removeFollowee,
} from './store';
import { modalStore } from '@skeletonlabs/skeleton';

export const JWT_DB_KEY = 'JWTDatabase';
export const JWT_OAUTH_KEY = 'JWTOAuth';

export const enum BaseUrl {
	USERS = '/api/users/',
	CHANNELS = '/api/channels/',
	PARTICIPANTS = '/api/participants/',
	ADMINISTRATORS = '/api/administrators/',
	BANNED = '/api/bans/',
	BLOCKED = '/api/blocks/',
	FOLLOWS = '/api/follows/',
}

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

export function dateReviver(key: string, value: any) {
	if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
	return value;
}

export function channelContentDateReviver(key: string, value: any) {
	if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
	if (key === 'messages') {
		value = value.map((each: any) => {
			const { createdAt, ...others } = each;
			return { ...others, createdAt: new Date(createdAt) };
		});
	}
	return value;
}

export function loadPage(routeParam: number) {
	goto(`/channel/${routeParam}`);
}

export async function block(blockeeId: number) {
	const blocked = await postRequestApi(BaseUrl.BLOCKED, {
		blockeeId: blockeeId,
	});
	addBlockee(blocked.blockee);
	if (blocked.channelId) removeDirect(blocked.channelId);
}

export async function unblock(blockeeId: number) {
	const blockee = await deleteRequestApi(BaseUrl.BLOCKED + `${blockeeId}`);
	removeBlockee(blockee.blockee);
}

export function isblocked(userId: number) {
	return get(blockeeStore).some((b) => b.id === userId);
}

export function showProfile(id: number): void {
	activateProfile(id);
	modalStore.close();
}

export async function follow(followeeId: number) {
	const followee = await postRequestApi(BaseUrl.FOLLOWS, {
		followeeId: followeeId,
	});
	addFollowee(followee.followee);
}

export async function unfollow(followeeId: number) {
	const followee = await deleteRequestApi(BaseUrl.FOLLOWS + followeeId);
	removeFollowee(followee.followee);
}

export const channelIcon: { [index: string]: string } = {
	PUBLIC: 'fa fa-users',
	PRIVATE: 'fa fa-user-secret',
	PROTECTED: 'fa fa-lock fa-lg',
};
