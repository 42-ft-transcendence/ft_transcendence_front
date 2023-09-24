import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { deleteRequestApi, postRequestApi } from './fetch';
import { io } from 'socket.io-client';
import {
	activateProfile,
	addBlockee,
	addFollowee,
	addNewDirect,
	blockeeStore,
	removeBlockee,
	removeDirect,
	removeFollowee,
} from './store';
import { modalStore } from '@skeletonlabs/skeleton';

export const JWT_DB_KEY = 'JWTDatabase';
export const JWT_OAUTH_KEY = 'JWTOAuth';

export const socket = io({ auth: { token:''}, autoConnect: false}); //connect manually

export const enum BaseUrl {
	USERS = '/api/users/',
	CHANNELS = '/api/channels/',
	PARTICIPANTS = '/api/participants/',
	ADMINISTRATORS = '/api/administrators/',
	BANNED = '/api/bans/',
	BLOCKED = '/api/blocks/',
	FOLLOWS = '/api/follows/',
	AUTH = '/api/auth/'
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

export async function loadPage(routeParam: number) {
	await goto(`/channel/${routeParam}`);
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

export async function sendMessage(userId: number, userName: string) {
	const newDirect = await postRequestApi(BaseUrl.CHANNELS + 'directChannel', {
		interlocatorId: userId,
		interlocatorName: userName,
	});
	newDirect.userId = userId;
	addNewDirect(newDirect);
	socket.emit('create DMChannel', newDirect);
	loadPage(newDirect.id);
	//TOOD: close modal
}

export function showProfile(id: number): void {
	activateProfile(id);
	modalStore.close();
}

export async function follow(followeeId: number) {
	const followee = await postRequestApi(BaseUrl.FOLLOWS, {
		followeeId: followeeId,
	});
	socket.emit('create Followee', followee.followee);
}

export async function unfollow(followeeId: number) {
	const followee = await deleteRequestApi(BaseUrl.FOLLOWS + followeeId);
	socket.emit('remove Followee', { followeeId: followeeId })
}

export const channelIcon: { [index: string]: string } = {
	PUBLIC: 'fa fa-users',
	PRIVATE: 'fa fa-user-secret',
	PROTECTED: 'fa fa-lock fa-lg',
};
