import { get, writable } from 'svelte/store';
import type {
	LeftSideBarChannel,
	LeftSideBarDirect,
	UserChannel,
	UserDirectChannel,
	UserProfile,
} from './type';

export const channelUserInStore = writable(Array<LeftSideBarChannel>());
export const directUserInStore = writable(Array<LeftSideBarDirect>());
export const profileButtonStore = writable(false);
export const lSideBarButtonStore = writable(false);
export const profileIdStore = writable(-1);
export const blockeeStore = writable(Array<UserProfile>());
export const userIdStore = writable(-1);
export const followeeStore = writable(Array<UserProfile>());
export const twoFactorAuthStore = writable(false);
export const gameStateStore = writable('');

export function addNewChannel(newChannel: UserChannel) {
	const added: LeftSideBarChannel = {
		id: newChannel.id,
		name: newChannel.name,
		type: newChannel.type,
		href: `/channel/${newChannel.id}`,
	};
	if (get(channelUserInStore).every((c) => c.id !== added.id))
		channelUserInStore.update((channels) => {
			channels.push(added);
			return channels;
		});
}

export function removeChannel(channelId: number) {
	channelUserInStore.update((channels) =>
		channels.filter((c) => c.id != channelId),
	);
}

export function addNewDirect(newDirect: UserDirectChannel) {
	const added: LeftSideBarDirect = {
		href: `/channel/${newDirect.id}`,
		channelId: newDirect.id,
		userId: newDirect.userId,
		userName: newDirect.userName,
		avatar: newDirect.avatar,
	};
	if (get(directUserInStore).every((d) => d.channelId !== added.channelId))
		directUserInStore.update((directs) => {
			directs.push(added);
			return directs;
		});
}

export function removeDirect(channelId: number) {
	directUserInStore.update((directs) =>
		directs.filter((c) => c.channelId !== channelId),
	);
}

export function activateProfile(userId: number) {
	profileButtonStore.update(() => true);
	profileIdStore.update(() => userId);
}

export function deactivateProfile() {
	profileButtonStore.update(() => false);
}

export function activateLeftSideBar() {
	lSideBarButtonStore.update(() => true);
}

export function deactivateLeftSideBar() {
	lSideBarButtonStore.update(() => false);
}
export function addBlockee(blockee: UserProfile) {
	if (get(blockeeStore).every((b) => b.id !== blockee.id))
		blockeeStore.update((store) => { store.push(blockee); return store; });
}

export function removeBlockee(blockee: UserProfile) {
	blockeeStore.update((store) => store.filter(u => u.id !== blockee.id));
}

export function addFollowee(followee: UserProfile) {
	if (get(followeeStore).every((f) => f.id !== followee.id))
		followeeStore.update((store) => { store.push(followee); return store; });
}

export function removeFollowee(followee: UserProfile) {
	followeeStore.update((store) => store.filter(u => u.id !== followee.id));
}