import { JWT_COOKIE_KEY, getCookie, hasCookie } from "$lib/common";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

interface UserChannel {
    name: string,
    type: string,
    id: number,
}

const ONE_TO_ONE = 'ONETOONE';

export async function load({ url }) {
    let channels: UserChannel[];
    let directs: UserChannel[];
    //TODO: let friends
    let register = true;

    if (hasCookie(JWT_COOKIE_KEY)) {
        const userChannels: UserChannel[] = (await (await fetch('/api/channels/ofCurrentUser', {
            headers: { Authorization: `Bearer ${getCookie(JWT_COOKIE_KEY)}` }
        })).json()).map((channel: UserChannel) => ({ name: channel.name, type: channel.type, href: `/channel/${channel.id}` }));
        channels = userChannels.filter(c => c.type !== ONE_TO_ONE);
        directs = userChannels.filter(c => c.type === ONE_TO_ONE);
        console.log(userChannels);
    } else {
        channels = [];
        directs = [];
        register = false;
        if (url.pathname !== '/login') throw redirect(307, "/login");
    }
    return {
        chat: [
            { title: "Channel", list: channels },
            { title: "DM", list: directs },
            { title: "Friends", list: [] }
        ],
        game: {},
        register: register,
    };
}