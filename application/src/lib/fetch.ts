import { getCookie, JWT_COOKIE_KEY } from './common';

export async function getRequestApi(url: string) {
	return await requestGetDelete('GET', url);
}

export async function deleteRequestApi(url: string) {
	return await requestGetDelete('DELETE', url);
}

export async function postRequestApi(url: string, payload: any) {
	return await requestPostPatch('POST', url, payload);
}

export async function patchRequestApi(url: string, payload: any) {
	return await requestPostPatch('PATCH', url, payload);
}

export async function postRequestAuthApi(
	url: string,
	payload: any,
	targetInfo: any,
) {
	return await requestPostPatchAuth('POST', url, payload, targetInfo);
}

export async function patchRequestAuthApi(
	url: string,
	payload: any,
	targetInfo: any,
) {
	return await requestPostPatchAuth('PATCH', url, payload, targetInfo);
}

export async function deleteRequestAuthApi(url: string, targetInfo: any) {
	return await requestGetDeleteAuth('DELETE', url, targetInfo);
}

async function requestGetDelete(method: string, url: string) {
	const response = await fetch(url, {
		method: method,
		headers: { Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}` },
	});
	return await response.json();
}

async function requestPostPatch(method: string, url: string, payload: any) {
	const response = await fetch(url, {
		method: method,
		mode: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`,
		},
		body: JSON.stringify(payload),
	});
	return await response.json();
}

async function requestGetDeleteAuth(
	method: string,
	url: string,
	targetInfo: any,
) {
	const response = await fetch(url, {
		method: method,
		headers: {
			Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`,
			'Transcendence-Authorization-Channel-Id': `${targetInfo.channelId}`,
			'Transcendence-Authorization-User-Id': `${targetInfo.userId}`,
		},
	});
	return await response.json();
}

async function requestPostPatchAuth(
	method: string,
	url: string,
	payload: any,
	targetInfo: any,
) {
	const response = await fetch(url, {
		method: method,
		mode: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`,
			'Transcendence-Authorization-Channel-Id': `${targetInfo.channelId}`,
			'Transcendence-Authorization-User-Id': `${targetInfo.userId}`,
		},
		body: JSON.stringify(payload),
	});
	return await response.json();
}
