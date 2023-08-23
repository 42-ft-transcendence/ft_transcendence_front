export interface LeftSideBarChannel {
	href: string,
	name: string,
	type: string,
}

export interface LeftSideBarDirect {
	href: string,
	avatar: string,
	name: string,
}

export interface UserChannel {
	id: number;
	name: string;
	type: ChannelType;
	ownerId: number;
	createdAt: Date;
}

export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  ONETOONE = 'ONETOONE',
}