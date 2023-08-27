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