<script lang="ts">
	import { ContextMenu } from '$lib/ContextMenu/ContextMenu';
	import { BaseUrl, socket } from '$lib/common';
	import { deleteRequestApi } from '$lib/fetch';
	import { toastStore } from '@skeletonlabs/skeleton';

	export let pointerEvent: MouseEvent;

	let channelId: number;

	const contextmenu = new ContextMenu();
	$: {
		contextmenu.rightClickContextMenu(pointerEvent);
		contextmenu.pos.x = contextmenu.pos.x;
		contextmenu.pos.y = contextmenu.pos.y;
		if (pointerEvent.target instanceof HTMLElement)
			channelId = parseInt(pointerEvent.target.dataset.channelId as string);
	}
	async function leaveChannel() {
		//1. 현재 사용자가 현재 채널에서 일반 사용자인지, 관리자인지 소유자인지 구분
		/**
		 * 채널 소유자
		 * 1. 관리자가 있다면 관리자 중 가장 먼저 관리자가 된 사람에게 소유권을 넘긴다. 관리자가 없다면 일반 참여자 중 가장 먼저 참여한 사람에게  소유권을 넘긴다. 참여자가 아예 없다면 채널을 제거한다.
		 * 2. participant 모델에서 JWT 사용자, 현재 채널에 대한 데이터를 제거
		 * 3. administrator 모델에서 JWT 유저와 현재 채널에 대한 데이터를 제거
		 */
		/**
		 * 채널 관리자
		 * 1. participant 모델에서 JWT 사용자, 현재 채널에 대한 데이터를 제거
		 * 2. administrator 모델에서 JWT 유저와 현재 채널에 대한 데이터를 제거
		 */
		/**
		 * 일반 사용자
		 * 1. participant 모델에서 JWT 사용자, 현재 채널에 대한 데이터를 제거
		 */
		try {
			const channel = await deleteRequestApi(
				BaseUrl.PARTICIPANTS + `channelId/${channelId}`,
			);
			socket.emit('leave Channel', {channelId:channelId});
		} catch (error: any) {
			toastStore.trigger({
				message: error.message,
				background: 'variant-filled-warning',
				hideDismiss: true,
				timeout: 2000,
			})
		}
	}
	let menuItems = [
		{
			name: 'leave channel',
			onClick: leaveChannel,
			displayText: '채널 나가기',
			class: '',
		},
	];
</script>

<nav
	use:contextmenu.getContextMenuDimension
	class="bg-tertiary-100-800-token shadow-2xl border border-surface-500/30 z-50 rounded-lg"
	style="position: absolute; top:{contextmenu.pos.y}px; left:{contextmenu.pos
		.x}px">
	<div class="navbar" id="navbar">
		<ul>
			{#each menuItems as item, i}
				<li>
					<button
						class="text-left w-full p-2 hover:bg-surface-300 {menuItems.length ==
						1
							? 'rounded-lg'
							: i == 0
							? 'rounded-t-lg'
							: menuItems.length - 1 == i
							? 'rounded-b-lg'
							: ''}"
						on:click="{item.onClick}"
						><i class="{item.class}"></i>{item.displayText}</button>
				</li>
				{#if menuItems.length !== i + 1}
					<hr />
				{/if}
			{/each}
		</ul>
	</div>
</nav>
