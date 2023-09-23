<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ChannelContextMenu from '$lib/ContextMenu/ChannelContextMenu.svelte';
	import AddChannelContextMenu from '$lib/ContextMenu/AddChannelContextMenu.svelte';
	import DmContextMenu from '$lib/ContextMenu/DMContextMenu.svelte';
	import type { ComponentType } from 'svelte';
	import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { channelIcon } from '$lib/common';
	import StartDirectMessage from '$lib/Modal/StartDirectMessage.svelte';
	import {
		channelUserInStore,
		directUserInStore,
		followeeStore,
	} from '$lib/store';
	import { get } from 'svelte/store';
	import type {
		LeftSideBarChannel,
		LeftSideBarDirect,
		UserProfile,
	} from '$lib/type';
	import SearchFollowModal from '$lib/Modal/SearchFollowModal.svelte';
	import FollowContextMenu from '$lib/ContextMenu/FollowContextMenu.svelte';

	export let data: any;

	let userChannels: LeftSideBarChannel[];
	let userDirects: LeftSideBarDirect[];
	let userFollowees: UserProfile[];

	channelUserInStore.subscribe(() => {
		userChannels = get(channelUserInStore);
	});

	directUserInStore.subscribe(() => {
		userDirects = get(directUserInStore);
	});

	followeeStore.subscribe(() => {
		userFollowees = get(followeeStore);
	});

	const classOnline =
		'w-1.5 h-1.5 bg-success-500 relative top-2.5 rounded-full';
	const classOffline =
		'w-1.5 h-1.5 bg-neutral-500 relative top-2.5 rounded-full';
	const startDirectMessageModalComponent: ModalComponent = {
		ref: StartDirectMessage,
	};
	const searchFollowModalComponent: ModalComponent = {
		ref: SearchFollowModal,
	};
	let pointerEvent: MouseEvent | undefined;
	let contextmenuComponent: ComponentType | undefined;
	$: classesActive = (href: string) =>
		$page.url.pathname === href ? 'bg-primary-active-token' : '';

	function addCoworkers(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: startDirectMessageModalComponent,
		};
		modalStore.trigger(modal);
	}

	function addFollowees(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: searchFollowModalComponent,
		};
		modalStore.trigger(modal);
	}

	function handleRightClickedChannel(e: MouseEvent) {
		contextmenuComponent = ChannelContextMenu;
		pointerEvent = e;
	}

	function handleAddChannel(e: MouseEvent) {
		contextmenuComponent = AddChannelContextMenu;
		pointerEvent = e;
	}

	function handleRightClickedDM(e: MouseEvent) {
		contextmenuComponent = DmContextMenu;
		pointerEvent = e;
	}

	function handleFollowRightClick(e: MouseEvent) {
		contextmenuComponent = FollowContextMenu;
		pointerEvent = e;
	}

	function onPageClick(e: MouseEvent) {
		contextmenuComponent = undefined;
		pointerEvent = undefined;
	}
</script>

<TreeView padding="p-2.5">
	<TreeViewItem open="{true}">
		<span class="font-bold text-xl">{data.chat[0].title}</span>
		<svelte:fragment slot="children">
			<nav class="list-nav pr-2 pt-2">
				<ul>
					{#each userChannels as { id, href, type, name }}
						<li on:contextmenu|preventDefault="{handleRightClickedChannel}">
							<a
								href="{href}"
								data-channel-id="{id}"
								class="{classesActive(href)}"
								><i
									class="{channelIcon[type]} inline-block w-8 no-pointer-event"
									aria-hidden="true"></i
								>{name}</a>
						</li>
					{/each}
				</ul>
				<button
					class="w-full mt-1"
					on:click|stopPropagation="{handleAddChannel}"
					><i
						class="fa fa-plus-square text-left inline-block w-8"
						aria-hidden="true"></i
					>add channels</button>
			</nav>
		</svelte:fragment>
	</TreeViewItem>
	<TreeViewItem>
		<span class="font-bold text-xl">{data.chat[1].title}</span>
		<svelte:fragment slot="children">
			<nav class="list-nav pr-2 pt-2">
				<ul>
					{#each userDirects as { href, userId, avatar, userName, channelId }}
						<li on:contextmenu|preventDefault="{handleRightClickedDM}">
							<a
								href="{href}"
								data-user-id="{userId}"
								data-channel-id="{channelId}"
								class="{classesActive(href)}">
								<div
									class="w-full grid grid-cols-[auto_1fr_auto] no-pointer-event">
									<Avatar src="{avatar}" width="w-6" rounded="rounded-md" />
									<div class="ml-2 no-pointer-event">{userName}</div>
									<div class="{classOnline} no-pointer-event"></div>
								</div>
							</a>
						</li>
					{/each}
				</ul>
				<button class="w-full mt-1" on:click="{addCoworkers}"
					><i
						class="fa fa-plus-square text-left inline-block w-8"
						aria-hidden="true"></i
					>add coworkers</button>
			</nav>
		</svelte:fragment>
	</TreeViewItem>
	<TreeViewItem>
		<span class="font-bold text-xl">{data.chat[2].title}</span>
		<svelte:fragment slot="children">
			<nav class="list-nav pr-2 pt-2">
				<ul>
					{#each userFollowees as followee}
						<li on:contextmenu|preventDefault="{handleFollowRightClick}">
							<div class="list-option"
								data-user-id="{followee.id}"
								data-user-name="{followee.nickname}"
								>
								<div
									class="w-full grid grid-cols-[auto_1fr_auto] no-pointer-event">
									<Avatar
										src="{followee.avatar}"
										width="w-6"
										rounded="rounded-md" />
									<div class="ml-2 no-pointer-event">{followee.nickname}</div>
									<div class="{classOnline} no-pointer-event"></div>
								</div>
							</div>
						</li>
					{/each}
				</ul>
				<button class="w-full mt-1" on:click="{addFollowees}"
					><i
						class="fa fa-plus-square text-left inline-block w-8"
						aria-hidden="true"></i
					>add coworkers</button>
			</nav>
		</svelte:fragment>
	</TreeViewItem>
</TreeView>
{#if contextmenuComponent !== undefined}
	<svelte:component
		this="{contextmenuComponent}"
		pointerEvent="{pointerEvent}" />
{/if}
<svelte:window on:click="{onPageClick}" />

<style>
	.no-pointer-event {
		pointer-events: none;
	}
</style>
