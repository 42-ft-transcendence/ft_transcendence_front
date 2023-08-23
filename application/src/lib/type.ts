export interface LeftSideBarChannel {
	href: string,
	name: string,
	type: string,
}

export interface LeftSideBarDirect {
	href: string,
	channelId: number;
	avatar: string,
	userName: string,
}

export interface UserChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	createdAt: Date;
}

export interface UserDirectChannel {
	id: number,
	userName: string,
	avatar: string;
}

export enum ChannelType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
	PROTECTED = 'PROTECTED',
	ONETOONE = 'ONETOONE',
}