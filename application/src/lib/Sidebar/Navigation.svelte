<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import ChatNavigation from '$lib/Sidebar/ChatNavigation.svelte';
	import type { ComponentType } from 'svelte';

	interface RailTile {
		name: string;
		component: ComponentType | undefined;
		iconname: string;
		subtitle: string;
		href: string;
	}

	export let sidebarLeftBtn = false;
	export let data: any;
	let currentTile: number;
	let sidebarLeftExtension: ComponentType | undefined;
	const appRailTiles: RailTile[] = [
		{
			name: 'chat',
			component: ChatNavigation,
			iconname: 'fa fa-comment fa-lg',
			subtitle: 'Chat',
			href: '',
		},
		{
			name: 'game',
			component: undefined,
			iconname: 'fa fa-gamepad fa-lg',
			subtitle: 'Game',
			href: '/game',
		},
	];
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token w-0 ease-in-out duration-300 {sidebarLeftBtn
		? sidebarLeftExtension
			? 'border-r border-surface-500/30 sm:w-[450px]'
			: 'border-r border-surface-500/30 sm:w-20'
		: ''} ">
	<AppRail>
		{#each appRailTiles as appRailTile, i}
			{#if appRailTile.component}
				<AppRailTile
					bind:group="{currentTile}"
					name="{appRailTile.name}"
					value="{i}"
					title="{appRailTile.name}"
					on:click="{() => (sidebarLeftExtension = appRailTile.component)}">
					<svelte:fragment slot="lead">
						<i class="{appRailTile.iconname}" aria-hidden="true"></i>
					</svelte:fragment>
					<span>{appRailTile.subtitle}</span>
				</AppRailTile>
			{:else}
				<AppRailAnchor
					href="{appRailTile.href}"
					selected="{currentTile === i}"
					on:click="{() => {
						currentTile = i;
						sidebarLeftExtension = undefined;
					}}">
					<svelte:fragment slot="lead">
						<i class="{appRailTile.iconname}" aria-hidden="true"></i>
					</svelte:fragment>
					<span>{appRailTile.subtitle}</span>
				</AppRailAnchor>
			{/if}
		{/each}
	</AppRail>
	<svelte:component this="{sidebarLeftExtension}" data="{data}" />
</div>
