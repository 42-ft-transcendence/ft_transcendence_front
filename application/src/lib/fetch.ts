import { getCookie, JWT_DB_KEY } from './common';
function getErrorMessage(messages: Array<string>)
{
	return messages.find((msg) => !!msg);
}

export async function getRequestApi(url: string) {
	const response = await requestGetDelete('GET', url);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

export async function deleteRequestApi(url: string) {
	const response = await requestGetDelete('DELETE', url);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

export async function postRequestApi(url: string, payload: any) {
	const response = await requestPostPatch('POST', url, payload);
	const data = await response.json();
	// console.log(typeof data.message[0]); string
	// console.log((data.message).length); ok!
	if (!response.ok)
		throw new Error(getErrorMessage(data.message));
	return data;
}

export async function patchRequestApi(url: string, payload: any) {
	const response = await requestPostPatch('PATCH', url, payload);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

export async function postRequestAuthApi(
	url: string,
	payload: any,
	targetInfo: any,
) {
	const response = await requestPostPatchAuth('POST', url, payload, targetInfo);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

export async function patchRequestAuthApi(
	url: string,
	payload: any,
	targetInfo: any,
) {
	const response = await requestPostPatchAuth(
		'PATCH',
		url,
		payload,
		targetInfo,
	);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

export async function deleteRequestAuthApi(url: string, targetInfo: any) {
	const response = await requestGetDeleteAuth('DELETE', url, targetInfo);
	const data = await response.json();
	if (!response.ok)
		throw new Error(data.message);
	return data;
}

async function requestGetDelete(method: string, url: string) {
	try {
		return await fetch(url, {
			method: method,
			headers: { Authorization: `Bearer ${getCookie(JWT_DB_KEY)}` },
		});
	} catch (error) {
		throw new Error('네트워크 문제로 인해 요청을 처리하지 못했습니다.');
	}
}

async function requestPostPatch(method: string, url: string, payload: any) {
	try {
		return await fetch(url, {
			method: method,
			mode: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
			},
			body: JSON.stringify(payload),
		});
	} catch (error) {
		throw new Error('네트워크 문제로 인해 요청을 처리하지 못했습니다.');
	}
}

async function requestGetDeleteAuth(
	method: string,
	url: string,
	targetInfo: any,
) {
	try {
		return await fetch(url, {
			method: method,
			headers: {
				Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
				'Transcendence-Authorization-Channel-Id': `${targetInfo.channelId}`,
				'Transcendence-Authorization-User-Id': `${targetInfo.userId}`,
			},
		});
	} catch (error) {
		throw new Error('네트워크 문제로 인해 요청을 처리하지 못했습니다.');
	}
}

async function requestPostPatchAuth(
	method: string,
	url: string,
	payload: any,
	targetInfo: any,
) {
	try {
		return await fetch(url, {
			method: method,
			mode: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
				'Transcendence-Authorization-Channel-Id': `${targetInfo.channelId}`,
				'Transcendence-Authorization-User-Id': `${targetInfo.userId}`,
			},
			body: JSON.stringify(payload),
		});
	} catch (error) {
		throw new Error('네트워크 문제로 인해 요청을 처리하지 못했습니다.');
	}
}
