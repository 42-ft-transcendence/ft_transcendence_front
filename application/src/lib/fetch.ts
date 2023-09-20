import { getCookie, JWT_DB_KEY } from './common';

export async function getRequestApi(url: string) {
	const response = await requestGetDelete('GET', url);
	if (!response.ok) {
		if (response.status === 404)
			throw new Error('존재하지 않는 자원에 대한 요청입니다.');
	}
	return await response.json();
}

export async function deleteRequestApi(url: string) {
	const response = await requestGetDelete('DELETE', url);
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
}

export async function postRequestApi(url: string, payload: any) {
	const response = await requestPostPatch('POST', url, payload);
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
}

export async function patchRequestApi(url: string, payload: any) {
	const response = await requestPostPatch('PATCH', url, payload);
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
}

export async function postRequestAuthApi(
	url: string,
	payload: any,
	targetInfo: any,
) {
	const response = await requestPostPatchAuth('POST', url, payload, targetInfo);
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
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
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
}

export async function deleteRequestAuthApi(url: string, targetInfo: any) {
	const response = await requestGetDeleteAuth('DELETE', url, targetInfo);
	if (!response.ok) {
		//TODO: 적절한 예외 던지기
	}
	return await response.json();
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
