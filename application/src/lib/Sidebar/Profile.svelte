<script lang="ts">
	import {
		Avatar,
		modalStore,
		type ModalSettings,
		type ModalComponent,
	} from '@skeletonlabs/skeleton';
	import {
		activateProfile,
		blockeeStore,
		deactivateProfile,
		profileButtonStore,
		profileIdStore,
		twoFactorAuthStore,
		userIdStore,
	} from '$lib/store';
	import { BaseUrl, printError, sendMessage, unblock } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { MatchHistory, UserProfile } from '$lib/type';
	import Enable2FaModal from '$lib/Modal/Enable2FAModal.svelte';
	import Disable2FaModal from '$lib/Modal/Disable2FAModal.svelte';
	import BlockListContextMenu from '$lib/ContextMenu/BlockListContextMenu.svelte';
	import { goto } from '$app/navigation';
	import type { ComponentType } from 'svelte';
	import { loop_guard, onDestroy, onMount } from 'svelte/internal';
	import ShowMatchHistoryModal from '$lib/Modal/ShowMatchHistoryModal.svelte';

	let sidebarRightBtn = false;
	let profile: UserProfile;
	let blockList: UserProfile[];
	let isAuthenticated: boolean;

	let contextMenuComponent: ComponentType | undefined;
	let pointerEvent: MouseEvent | undefined;

	const unsubscribeProfileButton = profileButtonStore.subscribe(async () => {
		sidebarRightBtn = $profileButtonStore;
	});
	const unsubscribeProfileId = profileIdStore.subscribe(async () => {
		if ($profileIdStore === -1) return;
		try {
			profile = await getRequestApi(BaseUrl.USERS + $profileIdStore);
		} catch (err: any) {
			printError(err);
		}
	});
	const unsubscribeBlockee = blockeeStore.subscribe(() => {
		blockList = $blockeeStore;
	});
	const unsubscribTwoFactorAuth = twoFactorAuthStore.subscribe(() => {
		isAuthenticated = $twoFactorAuthStore;
	});

	onDestroy(() => {
		unsubscribeProfileButton();
		unsubscribeProfileId();
		unsubscribeBlockee();
		unsubscribTwoFactorAuth();
	});

	const enable2FAModalComponent: ModalComponent = {
		ref: Enable2FaModal,
	};

	async function enableTwoFactorAuth() {
		const modal: ModalSettings = {
			type: 'component',
			component: enable2FAModalComponent,
		};
		modalStore.trigger(modal);
	}

	const disableTwoFactorAuthModalComponent: ModalComponent = {
		ref: Disable2FaModal,
	};

	async function disableTwoFactorAuth() {
		const modal: ModalSettings = {
			type: 'component',
			component: disableTwoFactorAuthModalComponent,
		};
		modalStore.trigger(modal);
	}

	const showMatchHistoryModalComponent: ModalComponent = {
		ref: ShowMatchHistoryModal,
	};

	async function showMatchHistory() {
		const modal: ModalSettings = {
			type: 'component',
			component: showMatchHistoryModalComponent,
			meta: { userId: $profileIdStore },
		};
		modalStore.trigger(modal);
	}

	function handleRightClick(e: MouseEvent) {
		contextMenuComponent = BlockListContextMenu;
		pointerEvent = e;
	}

	function onPageClick(e: MouseEvent) {
		contextMenuComponent = undefined;
		pointerEvent = undefined;
	}

	async function editInfo() {
		await goto('/edit');
	}

	async function logout() {
		try {
			await getRequestApi(`${BaseUrl.AUTH}/logout`);
		} catch (err: any) {
			printError(err);
		} finally {
			location.reload();
			await goto('/login', { replaceState: true });
		}
	}
</script>

<div
	class="flex-col h-full bg-surface-100-800-token w-0 ease-in-out duration-300 {sidebarRightBtn
		? 'border-l border-surface-500/30 sm:w-64'
		: 'overflow-hidden'} ">
	<div class="grid grid-cols-[1fr_auto] p-2.5 border-y border-surface-500/30">
		<div class="gap-y-2 flex flex-col items-center">
			<div class="font-bold text-lg">{profile?.nickname}</div>
			{#if profile?.id === $userIdStore && !$twoFactorAuthStore}
				<button
					on:click="{enableTwoFactorAuth}"
					class="bg-surface-500 hover:bg-gray-100 text-white py-1 px-2 rounded text-xs"
					>2FA 설정하기</button>
			{/if}
			{#if profile?.id === $userIdStore && $twoFactorAuthStore}
				<button
					on:click="{disableTwoFactorAuth}"
					class="bg-surface-500 hover:bg-gray-100 text-white py-1 px-2 rounded text-xs"
					>2FA 해제하기</button>
			{/if}
			{#if profile?.id === $userIdStore}
				<button
					on:click="{editInfo}"
					class="bg-surface-500 hover:bg-gray-100 text-white py-1 px-2 rounded text-xs"
					>정보 수정</button>
				<button
					on:click="{logout}"
					class="bg-surface-500 hover:bg-gray-100 text-white py-1 px-2 rounded text-xs"
					>로그아웃</button>
			{/if}
		</div>
		<button
			class="p-2 rounded-md hover:bg-surface-200-700-token"
			on:click="{deactivateProfile}"
			><i class="fa fa-times" aria-hidden="true"></i></button>
	</div>
	<div class="flex flex-col items-center p-2.5 border-b border-surface-500/30">
		<Avatar src="{profile?.avatar}" width="w-44" />
		<div class="p-2.5 flex justify-around">
			{#if profile?.id !== $userIdStore}
				<button
					type="button"
					on:click="{async () =>
						await sendMessage(profile?.id, profile?.nickname)}"
					class="btn variant-filled">DM</button>
				<!-- <button type="button" class="btn variant-filled">GAME</button> -->
			{/if}
		</div>
	</div>
	<div class="p-2.5">
		<button
			on:click="{showMatchHistory}"
			class="font-bold text-lg hover:bg-gray-100 text-white py-1 rounded"
			>대전 기록</button>
	</div>
	{#if $userIdStore === $profileIdStore}
		<div class="p-2.5">
			<div class="font-bold text-lg">차단 목록</div>
			<ul>
				{#each blockList as blockee, i}
					{#if i !== 0}
						<hr />
					{/if}
					<li on:contextmenu|preventDefault="{handleRightClick}">
						<div
							class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400"
							data-user-id="{blockee.id}">
							<div
								class="w-full grid grid-cols-[auto_1fr_auto] no-pointer-event">
								<Avatar
									src="{blockee.avatar}"
									width="w-6"
									rounded="rounded-md" />
								<div class="ml-2 no-pointer-event">{blockee.nickname}</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
{#if contextMenuComponent !== undefined}
	<svelte:component
		this="{contextMenuComponent}"
		pointerEvent="{pointerEvent}" />
{/if}
<svelte:window on:click="{onPageClick}" />

<style>
	.no-pointer-event {
		pointer-events: none;
	}
</style>
