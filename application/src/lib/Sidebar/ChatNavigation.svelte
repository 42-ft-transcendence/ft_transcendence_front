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
	import { channelUserInStore } from '$lib/store';
	import { get } from 'svelte/store';

	export let data: any;

	const userChannels = get(channelUserInStore);

	const classOnline = 'w-1.5 h-1.5 bg-success-500 relative top-2.5 rounded-full';
	const classOffline = 'w-1.5 h-1.5 bg-neutral-500 relative top-2.5 rounded-full';
	const startDirectMessageModalComponent: ModalComponent = {
		ref: StartDirectMessage
	};
	let pointerEvent: MouseEvent | undefined;
	let contextmenuComponent: ComponentType | undefined;
	$: classesActive = (href: string) =>
		$page.url.pathname.startsWith(href) ? 'bg-primary-active-token' : '';

	function addCoworkers(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: startDirectMessageModalComponent
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
					{#each userChannels as { href, type, name }}
						<li on:contextmenu|preventDefault="{handleRightClickedChannel}">
							<a href="{href}" data-channel-name="{name}" class="{classesActive(href)}"
								><i class="{channelIcon[type]} inline-block w-8" aria-hidden="true"></i>{name}</a>
						</li>
					{/each}
				</ul>
				<button class="w-full mt-1" on:click|stopPropagation="{handleAddChannel}"
					><i class="fa fa-plus-square text-left inline-block w-8" aria-hidden="true"></i>add
					channels</button>
			</nav>
		</svelte:fragment>
	</TreeViewItem>
	<TreeViewItem open="{true}">
		<span class="font-bold text-xl">{data.chat[1].title}</span>
		<svelte:fragment slot="children">
			<nav class="list-nav pr-2 pt-2">
				<ul>
					{#each data.chat[1].list as { href, avatar, name }}
						<li on:contextmenu|preventDefault="{handleRightClickedDM}">
							<a href="{href}" class="{classesActive(href)}">
								<div class="w-full grid grid-cols-[auto_1fr_auto]">
									<Avatar
										src="https://i.pravatar.cc/?img={avatar}"
										width="w-6"
										rounded="rounded-md" />
									<div class="ml-2">{name}</div>
									<div class="{classOnline}"></div>
								</div>
							</a>
						</li>
					{/each}
				</ul>
				<button class="w-full mt-1" on:click="{addCoworkers}"
					><i class="fa fa-plus-square text-left inline-block w-8" aria-hidden="true"></i>add
					coworkers</button>
			</nav>
		</svelte:fragment>
	</TreeViewItem>
</TreeView>
{#if contextmenuComponent !== undefined}
	<svelte:component this="{contextmenuComponent}" pointerEvent="{pointerEvent}" />
{/if}
<svelte:window on:click="{onPageClick}" />
