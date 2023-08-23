import { get, writable } from "svelte/store";
import type { LeftSideBarChannel, LeftSideBarDirect, UserChannel } from "./type";

export const channelUserInStore = writable(Array<LeftSideBarChannel>());
// export const directUserInStore = writable(Array<LeftSideBarDirect>());

export function addNewChannel(newChannel: UserChannel) {
	const added: LeftSideBarChannel = {name: newChannel.name, type: newChannel.type, href: `/channel/${newChannel.id}`}
	channelUserInStore.update(channels => { channels.push(added); return channels;});
	console.log(get(channelUserInStore));
}

export function removeChannel(channelName: string) {
	channelUserInStore.update((channels) => channels.filter(c => c.name != channelName));
	console.log(get(channelUserInStore));
}

// export function addNewDirect(newDirect: any) {
// 	const added: LeftSideBarDirect = {name: newDirect.name, avatar: newDirect.}
// 	directUserInStore.update((directs) => ({...directs, newDirect}));
// }

// export function removeDirect(channelName: string) {
// 	directUserInStore.update((directs) => directs.filter(c => c.name != channelName));
// }