<script lang="ts">
	import {
		Avatar,
		modalStore,
		type ModalSettings,
		type ModalComponent,
		toastStore,
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
	import { BaseUrl, sendMessage, unblock } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { UserProfile } from '$lib/type';
	import Enable2FaModal from '$lib/Modal/Enable2FAModal.svelte';
	import Disable2FaModal from '$lib/Modal/Disable2FAModal.svelte';

	let sidebarRightBtn = false;
	let profile: UserProfile;
	let blockList: UserProfile[];
	let isAuthenticated: boolean;

	profileButtonStore.subscribe(() => {
		sidebarRightBtn = $profileButtonStore;
	});
	profileIdStore.subscribe(async () => {
		if ($profileIdStore === -1) return;
		try {
			profile = await getRequestApi(BaseUrl.USERS + $profileIdStore);
			if ($profileIdStore !== $userIdStore) blockList = [];
		} catch (error: any) {
			toastStore.trigger({
				message: error.message,
				background: 'variant-filled-warning',
				hideDismiss: true,
				timeout: 2000,
			})
		}
	});
	blockeeStore.subscribe(() => {
		blockList = $blockeeStore;
	});
	twoFactorAuthStore.subscribe(() => {
		isAuthenticated = $twoFactorAuthStore;
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
</script>

<div
	class="flex-col h-full bg-surface-100-800-token w-0 ease-in-out duration-300 {sidebarRightBtn
		? 'border-l border-surface-500/30 sm:w-64'
		: ''} ">
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
				<button type="button" on:click="{async () => await sendMessage(profile?.id, profile?.nickname)}" class="btn variant-filled">DM</button>
				<button type="button" class="btn variant-filled">GAME</button>
			{/if}
		</div>
	</div>
	<div class="p-2.5">
		<div class="font-bold text-lg">대전 기록</div>
	</div>
	{#if $userIdStore === $profileIdStore}
		<div class="p-2.5">
			<div class="font-bold text-lg">차단 목록</div>
			<ul>
				{#each blockList as blockee, i}
					{#if i !== 0}
						<hr />
					{/if}
					<li>
						<div
							class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
							<div class="flex items-center">
								<Avatar
									src="{blockee.avatar}"
									width="w-6"
									rounded="rounded-md" />
								<div class="ml-2">{blockee.nickname}</div>
							</div>
							<div class="flex item-center">
								<button
									type="button"
									class="btn btn-sm variant-filled hidden group-hover:block"
									on:click="{() => unblock(blockee.id)}">차단 해제</button>
								<button
									type="button"
									class="btn btn-sm variant-filled hidden group-hover:block"
									on:click="{() => activateProfile(blockee.id)}"
									>프로필 보기</button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
