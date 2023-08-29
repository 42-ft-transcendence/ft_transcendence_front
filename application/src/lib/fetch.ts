import { getCookie, JWT_COOKIE_KEY } from './common';


export async function getRequestApi(url: string) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}` }
  });
  return await response.json();
}

export async function postRequestApi(url: string, payload: any) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`
    },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

export async function deleteRequestApi(url: string) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`
    },
  });
  return await response.json();
}

export async function postRequestAuthApi(url: string, payload: any, channelId: number) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`,
			'Transcendence-Authorization': `${channelId}`,
    },
    body: JSON.stringify(payload)
  });
  return await response.json();
}

export async function deleteRequestAuthApi(url: string, channelId: number) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}`,
      'Transcendence-Authorization': `${channelId}`
    },
  });
  return await response.json();
}