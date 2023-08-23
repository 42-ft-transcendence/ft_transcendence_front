import { JWT_COOKIE_KEY, getCookie, hasCookie } from "$lib/common";
import { channelUserInStore } from "$lib/store";
import type { LeftSideBarChannel, LeftSideBarDirect, UserChannel } from "$lib/type";

export const ssr = false;

const ONE_TO_ONE = 'ONETOONE';

export async function load() {
    let channels: LeftSideBarChannel[];
    let directs: LeftSideBarDirect[];
    //TODO: let friends

    if (hasCookie(JWT_COOKIE_KEY)) {
        const userChannels: LeftSideBarChannel[] = (await (await fetch('/api/channels/ofCurrentUser', {
            headers: { Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}` }
        })).json()).map((channel: UserChannel) => ({ name: channel.name, type: channel.type, href: `/channel/${channel.id}` }));
        channels = userChannels.filter(c => c.type !== ONE_TO_ONE);
        // directs = userChannels.filter(c => c.type === ONE_TO_ONE);
    } else {
        //TODO: JWT 쿠키가 없다면 사이드바, 상단바를 감추고 로그인하도록 구현
        channels = [];
        // directs = [];
    }
    
    channelUserInStore.set(channels);
    // directUserInStore.set(directs);

    return {
        chat: [
            { title: "Channel", list: channels },
            { title: "DM", list: [] }, // directs },
            { title: "Friends", list: [] }
        ],
        game: {}
    };
}