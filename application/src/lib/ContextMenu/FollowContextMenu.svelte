<script lang="ts">
	import { goto } from '$app/navigation';
	import { ContextMenu } from '$lib/ContextMenu/ContextMenu';
	import SelectGameMapModal from '$lib/Modal/SelectGameMapModal.svelte';
	import { sendMessage, unfollow } from '$lib/common';
	import { activateProfile } from '$lib/store';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	export let pointerEvent: MouseEvent;
	let userId: number;
	let userName: string;

	const contextmenu = new ContextMenu();
	$: {
		contextmenu.rightClickContextMenu(pointerEvent);
		contextmenu.pos.x = contextmenu.pos.x;
		contextmenu.pos.y = contextmenu.pos.y;
		console.log(pointerEvent.target);
		if (pointerEvent.target instanceof HTMLElement) {
			userId = parseInt(pointerEvent.target.dataset.userId as string);
			userName = pointerEvent.target.dataset.userName as string;
		}
	}

	const selectGameMapModalComponent: ModalComponent = {
		ref: SelectGameMapModal,
	};

	function selectMap() {
		const modal: ModalSettings = {
			type: 'component',
			component: selectGameMapModalComponent,
			meta: {
				opponentId: userId,
			}
		};
		modalStore.trigger(modal);
	}

	let menuItems = [
		{
			name: 'send message',
			onClick: async () => await sendMessage(userId, userName),
			displayText: '메시지 보내기',
			class: '',
		},
		{
			name: 'see profile',
			onClick: () => activateProfile(userId),
			displayText: '프로필 보기',
			class: '',
		},
		{
			name: 'unfollow',
			onClick: () => unfollow(userId),
			displayText: '팔로우 끊기',
			class: '',
		},
		{
			name: 'invite',
			onClick: selectMap,
			displayText: '게임 초대하기',
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
