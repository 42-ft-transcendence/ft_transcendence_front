<script lang="ts">
	import { goto } from '$app/navigation';
	import { ContextMenu } from '$lib/ContextMenu/ContextMenu';
	import { BaseUrl, loadPage, unfollow } from '$lib/common';
	import { postRequestApi } from '$lib/fetch';
	import { activateProfile, addNewDirect } from '$lib/store';

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

	async function doUnfollow() {
		unfollow(userId);
		goto('http://localhost:8080/'); //TODO: 루트 페이지 경로 .env로 활용?
	}

	async function sendMessage() {
		const newDirect = await postRequestApi(BaseUrl.CHANNELS + 'directChannel', {
			interlocatorId: userId,
			interlocatorName: userName,
		});
		console.log(newDirect);
		newDirect['userId'] = userId;
		addNewDirect(newDirect);
		loadPage(newDirect.id);
		//TOOD: close modal
	}

	let menuItems = [
		{
			name: 'send message',
			onClick: sendMessage,
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
			onClick: doUnfollow,
			displayText: '팔로우 끊기',
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
