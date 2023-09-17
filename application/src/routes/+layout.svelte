<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import {
		AppBar,
		AppShell,
		Toast,
		toastStore,
		type ToastSettings,
	} from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/Sidebar/Navigation.svelte';
	import Profile from '$lib/Sidebar/Profile.svelte';
	import { Modal } from '@skeletonlabs/skeleton';
	import {
		activateProfile,
		addNewChannel,
		addNewDirect,
		channelUserInStore,
		directUserInStore,
		userIdStore,
	} from '$lib/store';
	import { getCookie, hasCookie, socket } from '$lib/common';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { JWT_DB_KEY } from '../lib/common';

	export let data;
	$: authenticated = data.authenticated;
	let sidebarLeftBtn = false;
	let preChanRoom: string | undefined = undefined; // default '/' ?
	$: {
		if (
			(preChanRoom && preChanRoom.includes('/channel')) ||
			$page.url.pathname.includes('/game')
		) {
			socket.emit('leave Room', preChanRoom);
		}
		preChanRoom = $page.url.pathname;
		if (
			$page.url.pathname.includes('/channel') ||
			$page.url.pathname.includes('/game')
		) {
			socket.emit('join Room', $page.url.pathname);
		}
	}
	//TODO: 인자가 -1이면 사용자 자기 자신의 프로필을 불러오도록 구현했었지만, 현재 사용자가 로그인할 시 현재 사용자의 id를 스토어에 저장해 활용할 것이므로, 이를 활용하도록 하자.

	if (hasCookie(JWT_DB_KEY)) {
		socket.auth.token = `${getCookie(JWT_DB_KEY)}`;
		socket.connect();
	}

	socket.on('kick User', async (payload) => {
		const t: ToastSettings = {
			message: `관리자에 의해 ${payload.channelName}채널에서 내보내졌습니다.`,
			background: 'variant-filled-tertiary',
			hideDismiss: true,
			timeout: 10000,
		};
		toastStore.trigger(t);
		$channelUserInStore = $channelUserInStore.filter(
			(channel) => channel.id !== payload.channelId,
		);
		if ($page.url.pathname !== '/channel/' + payload.channelId) return;
		await goto('/');
	});

	socket.on('create Channel', (payload) => {
		addNewChannel(payload);
	});

	socket.on('remove Channel', async (payload) => {
		$channelUserInStore = $channelUserInStore.filter(
			(channel) => channel.id !== payload.channelId,
		);
		if ($page.url.pathname !== '/channel/' + payload.channelId) return;
		await goto('/');
	});

	socket.on('create DMChannel', (payload) => {
		addNewDirect(payload);
	});

	socket.on('remove DMChannel', async (payload) => {
		$directUserInStore = $directUserInStore.filter(
			(DMChannel) => DMChannel.channelId !== payload.channelId,
		);
		if ($page.url.pathname !== '/channel/' + payload.channelId) return;
		await goto('/');
	});
</script>

<Modal />
<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				{#if authenticated}
					<button
						class="invisible sm:visible"
						on:click="{() => (sidebarLeftBtn = !sidebarLeftBtn)}">
						<i class="fa fa-bars fa-lg" aria-hidden="true"></i>
					</button>
				{/if}
			</svelte:fragment>
			<b>PonGo</b>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<!-- TODO this will be changed for OS mode-->
				{#if authenticated}
					<button on:click="{() => activateProfile($userIdStore)}"
						><i class="fa fa-user-circle-o fa-lg" aria-hidden="true"></i
						></button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if authenticated}
			<Navigation sidebarLeftBtn="{sidebarLeftBtn}" data="{data}" />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		{#if authenticated}
			<Profile />
		{/if}
	</svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>
