export interface LeftSideBarChannel {
	id: number;
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
	otpSecret?: string; //TODO: 제거하기
	is2FAEnabled: boolean;	
	avatar: string;
	nickname: string;
	winCount: number;
	loseCount: number;
	ladder: Ladder;
	createdAt: string; //TODO: string? Date?
	updatedAt: string; //TODO: string? Date?
}

export interface Blockee {
	blockee: UserProfile;
}

export interface Followee {
	followee: UserProfile;
}

export interface MatchHistory {
	winner: { id: number, avatar: string, nickname: string 	};
	loser: { id: number, avatar: string, nickname: string };
}

export interface MatchHistoryDetail {
	type: string,
	mapType: string,
	matchAt: Date,
	winnerId: number,
	loserId: number,
	winner: { avatar: string, nickname: string };
	loser: { avatar: string, nickname: string };
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
