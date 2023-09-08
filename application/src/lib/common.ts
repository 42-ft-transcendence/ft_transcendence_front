import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { deleteRequestApi, postRequestApi } from './fetch';
import { addBlockee, blockeeStore, removeBlockee, removeDirect } from './store';
import { io } from 'socket.io-client';

export const JWT_COOKIE_KEY = 'JsonWebToken';

export const socket = io({ auth: { token:''}, autoConnect: false}); //connect manually

export const enum BaseUrl {
	USERS = '/api/users/',
	CHANNELS = '/api/channels/',
	PARTICIPANTS = '/api/participants/',
	ADMINISTRATORS = '/api/administrators/',
	BANNED = '/api/bans/',
	BLOCKED = '/api/blocks/',
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
	const blocked = await postRequestApi(BaseUrl.BLOCKED, {blockeeId: blockeeId});
	addBlockee(blocked.blockee);
	if (blocked.channelId)
		removeDirect(blocked.channelId);
}

export async function unblock(blockeeId: number) {
	const blockee = await deleteRequestApi(BaseUrl.BLOCKED + `${blockeeId}`);
	removeBlockee(blockee.blockee);
}

export function isblocked(userId: number) {
	return get(blockeeStore).some(b => b.id === userId);
}
export const channelIcon: { [index: string]: string } = {
	PUBLIC: 'fa fa-users',
	PRIVATE: 'fa fa-user-secret',
	PROTECTED: 'fa fa-lock fa-lg',
};
