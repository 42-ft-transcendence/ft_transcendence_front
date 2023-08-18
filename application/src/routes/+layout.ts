import { getCookie, hasCookie } from "$lib/common";

export const ssr = false;

interface UserChannel {
    name: string,
    type: string,
    id: number,
}

const ONE_TO_ONE = 'ONETOONE';

export async function load() {
    let channels: UserChannel[];
    let directs: UserChannel[];
    //TODO: let friends

    if (hasCookie('JsonWebToken')) {
        const userChannels: UserChannel[] = (await (await fetch('/api/channels/ofCurrentUser', {
            headers: { Authorization: `Bearer ${getCookie('JsonWebToken')}` }
        })).json()).map((channel: UserChannel) => ({name: channel.name, type: channel.type, href: `/channel/${channel.id}`}));
        channels = userChannels.filter(c => c.type !== ONE_TO_ONE);
        directs = userChannels.filter(c => c.type === ONE_TO_ONE);
        console.log(userChannels);
    } else {
        channels = [];
        directs = [];
    }
    return {
        chat: [
            { title: "Channel", list: channels },
            { title: "DM", list: directs },
            { title: "Friends", list: [] }
        ],
        game: {}
    };
}