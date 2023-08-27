import { BaseUrl, JWT_COOKIE_KEY, getCookie, hasCookie } from "$lib/common";
import { getRequestApi } from '$lib/fetch';
import { channelUserInStore, directUserInStore } from "$lib/store";
import type { LeftSideBarChannel, LeftSideBarDirect, UserChannel } from "$lib/type";

export const ssr = false;

const ONE_TO_ONE = 'ONETOONE';

export async function load() {
    let channels: LeftSideBarChannel[];
    let directs: LeftSideBarDirect[];
    //TODO: let friends

    if (hasCookie(JWT_COOKIE_KEY)) {
        channels = (await getRequestApi(BaseUrl.CHANNELS + 'channelsUserIn'))
            .map((channel: any) => ({ name: channel.name, type: channel.type, href: `/channel/${channel.id}` }));
        directs = (await getRequestApi(BaseUrl.CHANNELS + 'directsUserIn'))
            .map((direct: any) => ({ channelId: direct.channelId, userName: direct.userName, avatar: direct.avatar, href: `/channel/${direct.channelId}` }));
    } else {
        //TODO: JWT 쿠키가 없다면 사이드바, 상단바를 감추고 로그인하도록 구현
        channels = [];
        directs = [];
    }
    channelUserInStore.set(channels);
    directUserInStore.set(directs);
    return {
        chat: [
            { title: "Channel", list: channels },
            { title: "DM", list: directs },
            { title: "Friends", list: [] }
        ],
        game: {}
    };
}