<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import {
		deactivateProfile,
		profileButtonStore,
		profileInfoStore,
	} from '$lib/store';
	import { BaseUrl } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { UserProfile } from '$lib/type';

	let sidebarRightBtn = false;
	let profile: UserProfile;

	profileButtonStore.subscribe(() => {
		sidebarRightBtn = $profileButtonStore;
	});
	profileInfoStore.subscribe(async () => {
		profile = await getRequestApi(
			BaseUrl.USERS +
				($profileInfoStore !== -1 ? $profileInfoStore : 'oneself'),
		);
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
</div>
