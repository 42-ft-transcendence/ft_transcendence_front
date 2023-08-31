import { writable } from 'svelte/store';
import type {
	LeftSideBarChannel,
	LeftSideBarDirect,
	UserChannel,
	UserDirectChannel,
} from './type';

export const channelUserInStore = writable(Array<LeftSideBarChannel>());
export const directUserInStore = writable(Array<LeftSideBarDirect>());
export const profileButtonStore = writable(false);
export const profileInfoStore = writable(-1);

export function addNewChannel(newChannel: UserChannel) {
	const added: LeftSideBarChannel = {
		name: newChannel.name,
		type: newChannel.type,
		href: `/channel/${newChannel.id}`,
	};
	channelUserInStore.update((channels) => {
		channels.push(added);
		return channels;
	});
}

export function removeChannel(channelName: string) {
	channelUserInStore.update((channels) =>
		channels.filter((c) => c.name != channelName),
	);
}

export function addNewDirect(newDirect: UserDirectChannel) {
	const added: LeftSideBarDirect = {
		userId: newDirect.userId,
		channelId: newDirect.id,
		userName: newDirect.userName,
		avatar: newDirect.avatar,
		href: `/channel/${newDirect.id}`,
	};
	directUserInStore.update((directs) => {
		directs.push(added);
		return directs;
	});
}

export function removeDirect(channelId: number) {
	directUserInStore.update((directs) =>
		directs.filter((c) => c.channelId != channelId),
	);
}

export function activateProfile(userId: number) {
	profileButtonStore.update(() => true);
	profileInfoStore.update(() => userId);
}

export function deactivateProfile() {
	profileButtonStore.update(() => false);
}
