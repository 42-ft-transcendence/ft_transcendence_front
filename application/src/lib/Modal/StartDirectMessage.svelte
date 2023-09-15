<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { BaseUrl, block, loadPage, socket } from '$lib/common';
	import { getRequestApi, postRequestApi } from '$lib/fetch';
	import { addNewDirect, blockeeStore, directUserInStore, userIdStore } from '$lib/store';
	import { get } from 'svelte/store';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	let users: any[] | undefined;

	let interlocatorNames: string[];

	directUserInStore.subscribe(() => {
		interlocatorNames = get(directUserInStore).map((direct) => direct.userName);
		if (users)
			users = users.filter(
				(user) => !interlocatorNames.includes(user.nickname),
			);
	});

	let input: string;
	// Form Data
	const formData = {
		name: '',
		password: undefined,
	};

	async function searchUser() {
		users = await getRequestApi(
			BaseUrl.USERS + (input ? `name/?name=${input}` : ''),
		);
		if (users) {
			users = users.filter(
				(user) => !interlocatorNames.includes(user.nickname),
			);
		}
	}

	async function startDM(event: MouseEvent) {
		// TODO fuc joinChannel
		const button = event.target as HTMLButtonElement;
		const userId = parseInt(button.dataset.userId as string);
		const userName = button.dataset.userName;

		const newDirect = await postRequestApi(BaseUrl.CHANNELS + 'directChannel', {
			interlocatorId: userId,
			interlocatorName: userName,
		});
		modalStore.close();
		newDirect['userId'] = userId;
		socket.emit('join DMChannel', newDirect);
		loadPage(newDirect.id);
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
	const cUsers = 'rounded-md w-full max-h-96 p-4 overflow-y-auto';
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">Start a DirectMessage</header>
		<form class="modal-form {cForm}">
			<label class="label">
				<span class="font-bold">유저 이름</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><i class="fa fa-search"></i></div>
					<input
						class="pl-2 py-1.5"
						bind:value="{input}"
						type="search"
						placeholder="Enter the user name..." />
					<button
						class="variant-filled-secondary hover:brightness-125 active:scale-[95%] active:brightness-90"
						on:click="{searchUser}">Search</button>
				</div>
			</label>
			{#if users === undefined}
				<div class="text-center {cUsers}">유저 이름을 검색하세요</div>
			{:else if users.length === 0}
				<div class="text-center {cUsers}">결과 없음</div>
			{:else}
				<div class="{cUsers}">
					<nav class="">
						<ul>
							{#each users as user, i}
								{#if i !== 0}
									<hr />
								{/if}
								<li>
									<div
										class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
										<div class="flex items-center">
											<Avatar
												src="{user.avatar}"
												width="w-6"
												rounded="rounded-md" />
											<div class="ml-2">{user.nickname}</div>
										</div>
										<div class="flex items-center">
											{#if user.id !== $userIdStore && !$blockeeStore.some(b => b.id === user.id)}
												<button
													type="button"
													class="btn btn-sm variant-filled hidden group-hover:block"
													on:click="{() => block(user.id)}">차단</button>
												<button
													type="button"
													class="btn btn-sm variant-filled hidden group-hover:block"
													data-user-id="{user.id}"
													data-user-name="{user.nickname}"
													on:click="{startDM}">대화 시작</button>
											{/if}		
										</div>
									</div>
								</li>
							{/each}
						</ul>
					</nav>
				</div>
			{/if}
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click="{parent.onClose}"
				>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}
