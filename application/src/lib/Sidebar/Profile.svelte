<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import {
	activateProfile,
		blockeeStore,
		deactivateProfile,
		profileButtonStore,
		profileIdStore,
		userIdStore,
	} from '$lib/store';
	import { BaseUrl, unblock } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { UserProfile } from '$lib/type';
	import { get } from 'svelte/store';

	let sidebarRightBtn = false;
	let profile: UserProfile;
	let blockList: UserProfile[];

	profileButtonStore.subscribe(() => {
		sidebarRightBtn = $profileButtonStore;
	});
	profileIdStore.subscribe(async () => {
		if ($profileIdStore === -1) return;
		profile = await getRequestApi(BaseUrl.USERS + $profileIdStore);
		if ($profileIdStore !== $userIdStore)
			blockList = [];
	});
	blockeeStore.subscribe(() => {
		blockList = $blockeeStore;
	});
</script>

<div
	class="flex-col h-full bg-surface-100-800-token w-0 ease-in-out duration-300 {sidebarRightBtn
		? 'border-l border-surface-500/30 sm:w-64'
		: ''} ">
	<div class="grid grid-cols-[1fr_auto] p-2.5 border-y border-surface-500/30">
		<div class="flex items-center">
			<div class="font-bold text-lg">{profile?.nickname}</div>
		</div>
		<button
			class="p-2 rounded-md hover:bg-surface-200-700-token"
			on:click="{deactivateProfile}"
			><i class="fa fa-times" aria-hidden="true"></i></button>
	</div>
	<div class="flex flex-col items-center p-2.5 border-b border-surface-500/30">
		<Avatar src="{profile?.avatar}" width="w-44" />
		<div class="p-2.5 flex justify-around">
			<button type="button" class="btn variant-filled">DM</button>
			<button type="button" class="btn variant-filled">GAME</button>
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
										on:click="{() => unblock(blockee.id)}"
										>차단 해제</button>
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
