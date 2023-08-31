export interface LeftSideBarChannel {
	href: string;
	name: string;
	type: string;
}

export interface UserChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	createdAt: Date;
}

export interface LeftSideBarDirect {
	href: string;
	channelId: number;
	userId: number;
	userName: string;
	avatar: string;
}

export interface UserDirectChannel {
	id: number;
	userId: number;
	userName: string;
	avatar: string;
}

export interface UserProfile {
	id: number;
	fourtyTwoId: number; //TODO: 제거하기
	avatar: string;
	nickname: string;
	winCount: number;
	loseCount: number;
	ladder: Ladder;
	createdAt: string; //TODO: string? Date?
	updatedAt: string; //TODO: string? Date?
}

export enum ChannelType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
	PROTECTED = 'PROTECTED',
	ONETOONE = 'ONETOONE',
}

export enum Ladder {
	BRONZE = 'BRONZE',
	SILVER = 'SILVER',
	GOLD = 'GOLD',
}
