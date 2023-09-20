<script lang="ts">
	import { TabGroup, Tab, modalStore, toastStore } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { BaseUrl, block, socket, showProfile } from '$lib/common';
	import {
		deleteRequestAuthApi,
		getRequestApi,
		patchRequestAuthApi,
		postRequestAuthApi,
	} from '$lib/fetch';
	import { onMount } from 'svelte';
	import { activateProfile, blockeeStore, userIdStore } from '$lib/store';
	import { ChannelType } from '$lib/type';
	import { goto } from '$app/navigation';
	import type { HttpError } from '@sveltejs/kit';

	//TODO: 관리자에 대한 ban, kick, mute 가능해야 하나? nono

	type User = {
		id: number;
		nickname: string;
		avatar: string;
	};

	type Content = {
		isOwner: boolean;
		isAdmin: boolean;
		participants: {
			user: User;
		}[];
		administrators: {
			user: User;
		}[];
		bans: {
			user: User;
		}[];
	};

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	let participants: User[] = [];
	let administrators: User[] = [];
	let banned: User[] = [];

	let normalParticipants: User[] = [];

	let content: Content = {
		isOwner: false,
		isAdmin: false,
		participants: [],
		administrators: [],
		bans: [],
	};

	let adminSwitch = false;

	let input: string; //TODO: 여러 구성 요소에서 동일한 변수인 input을 사용자의 입력을 받는데 사용하면 해당 구성 요소들 중 하나에 값을 입력했을 때 모든 구성 요소에 동일한 내용이 표시된다. 구성 요소마다 서로 다른 변수를 사용하도록 하자.
	let tabSet: number = 0;
	// Form Data
	const formData = {
		name: '',
		password: undefined,
	};

	onMount(async () => {
		adminSwitch = localStorage.getItem('adminSwitch') === 'true';
		try {
			content = await getRequestApi(
				BaseUrl.CHANNELS + `${$modalStore[0].meta.id}/contents`,
			);
			participants = content.participants.map((p) => p.user);
			administrators = content.administrators.map((a) => a.user);
			banned = content.bans.map((b) => b.user);
	
			normalParticipants = participants.filter(
				(p) => !administrators.some((a) => a.nickname === p.nickname),
			);
		} catch (error: any) {
			toastStore.trigger({
				message: `${error.message} 다시 시도해주세요.`,
				background: 'variant-filled-warning',
				hideDismiss: true,
				timeout: 2000,
			})
		}
	});

	function toggleAdminSwitch() {
		adminSwitch = !adminSwitch;
		localStorage.setItem('adminSwitch', `${adminSwitch}`);
	}

	async function ban(userId: number) {
		const payload = {
			userId: userId,
			channelId: parseInt($modalStore[0].meta.id),
		};
		//TODO: 루트 파라미터로 자원을 특정하고 요청 바디를 비우는 게 적절할까 아니면 루트 파라미터를 사용하지 않고 uri를 /ban으로 설정한 뒤 요청 바디를 사용하는 게 적절할까
		const user = await postRequestAuthApi(BaseUrl.BANNED, payload, payload); //TODO: 여기선 가드를 위한 사용자 정의 헤더도 중복이 되나?
		participants = participants.filter((p) => p.id !== user.id);
		normalParticipants = normalParticipants.filter((p) => p.id !== user.id);
		banned = [...banned, user];
	}

	async function kick(userId: number) {
		const channelId = parseInt($modalStore[0].meta.id);
		const payload = {
			userId: userId,
			channelId: channelId,
		};
		//TODO: 루트 파라미터로 자원을 특정하고 요청 바디를 비우는 게 적절할까 아니면 루트 파라미터를 사용하지 않고 uri를 /kick으로 설정한 뒤 요청 바디를 사용하는 게 적절할까
		const user = await deleteRequestAuthApi(
			BaseUrl.PARTICIPANTS + `userId/${userId}/channelId/${channelId}`,
			payload,
		);
		socket.emit('kick User', {
			channelId: channelId,
			targetId: userId,
			channelName: $modalStore[0].meta.title,
		});
		participants = participants.filter((p) => p.id !== user.id);
		normalParticipants = normalParticipants.filter((p) => p.id !== user.id);
	}

	function mute(userId: number) {
		const channelId = parseInt($modalStore[0].meta.id);
		socket.emit('mute User', { channelId: channelId, targetId: userId });
		// TODO: 필요한 경우 guard로부터 오는 에러 핸들링
	}

	async function unban(userId: number) {
		const channelId = parseInt($modalStore[0].meta.id);
		const user = await deleteRequestAuthApi(
			BaseUrl.BANNED + `userId/${userId}/channelId/${channelId}`,
			{ channelId: channelId, userId: userId },
		);
		banned = banned.filter((b) => b.id !== user.id);
	}

	async function addAdministrator(id: number) {
		const channelId = $modalStore[0].meta.id;
		const payload = { channelId: channelId, userId: id };
		const admin = await postRequestAuthApi(
			BaseUrl.ADMINISTRATORS,
			payload,
			payload,
		);
		administrators = [...administrators, admin];
		normalParticipants = normalParticipants.filter((p) => p.id !== id);
	}
	//TODO: authorization "owner"
	async function removeAdministrator(id: number) {
		const channelId = $modalStore[0].meta.id;
		const payload = { channelId: channelId, userId: id };
		const removed = await deleteRequestAuthApi(
			BaseUrl.ADMINISTRATORS + `channelId/${channelId}/userId/${id}`,
			payload,
		);
		administrators = administrators.filter((a) => a.id !== id);
		normalParticipants = [...normalParticipants, removed];
	}

	async function dispatchBlock(id: number) {
		await block(id);
		if ($modalStore[0].meta.type === ChannelType.ONETOONE) {
			modalStore.close();
			await goto('/');
		}
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
	const cUsers = 'rounded-md w-full max-h-96 p-4 overflow-y-auto';
	const cChannelInfoTableHead = 'p-2';
	const cChannelInfoTableBody = 'p-2';
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">채널 정보</header>
		<TabGroup>
			<Tab bind:group="{tabSet}" name="member" value="{0}">정보</Tab>
			<Tab bind:group="{tabSet}" name="member" value="{1}">멤버</Tab>
			{#if content.isOwner && $modalStore[0].meta.type !== 'ONETOONE'}
				<Tab bind:group="{tabSet}" name="member" value="{2}">관리</Tab>
			{/if}
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<div
						class="grid grid-cols-[auto_1fr] border border-surface-500 space-y-4 rounded-container-token">
						<!-- TODO API 맞춰서 변경 -->
						<div class="{cChannelInfoTableHead}">채널 이름</div>
						<div class="{cChannelInfoTableBody}">
							{$modalStore[0].meta.title}
						</div>
						<div class="{cChannelInfoTableHead}">채널 소유자</div>
						<div class="{cChannelInfoTableBody}">
							{$modalStore[0].meta.owner}
						</div>
						<div class="{cChannelInfoTableHead}">타입</div>
						<div class="{cChannelInfoTableBody}">
							{$modalStore[0].meta.type}
						</div>
						<div class="{cChannelInfoTableHead}">생성날짜</div>
						<div class="{cChannelInfoTableBody}">
							{$modalStore[0].meta.createdAt}
						</div>
					</div>
				{:else if tabSet === 1}
					<form class="modal-form {cForm}">
						<label class="label">
							<span class="font-bold">유저 이름</span>
							<div class="input-group input-group-divider grid-cols-[auto_1fr]">
								<div class="input-group-shim"><i class="fa fa-search"></i></div>
								<input
									class="pl-2 py-1.5"
									bind:value="{input}"
									type="search"
									placeholder="Enter the user name..." />
							</div>
						</label>
						<div class="{cUsers}">
							<nav>
								<ul>
									<li>관리자</li>
									{#each administrators as { id, nickname, avatar }, i}
										{#if i !== 0}
											<hr />
										{/if}
										<li>
											<div
												class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
												<div class="flex items-center">
													<Avatar
														src="{avatar}"
														width="w-6"
														rounded="rounded-md" />
													<div class="ml-2">{nickname}</div>
												</div>
												<div class="flex item-center">
													{#if id !== $userIdStore && !$blockeeStore.some((b) => b.id === id)}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => dispatchBlock(id)}">차단</button>
													{/if}
													<button
														type="button"
														class="btn btn-sm variant-filled hidden group-hover:block"
														on:click="{() => showProfile(id)}"
														>프로필 보기</button>
												</div>
											</div>
										</li>
									{/each}
									<li>참여자</li>
									{#each normalParticipants as { id, nickname, avatar }, i}
										{#if i !== 0}
											<hr />
										{/if}
										<li>
											<div
												class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
												<div class="flex items-center">
													<Avatar
														src="{avatar}"
														width="w-6"
														rounded="rounded-md" />
													<div class="ml-2">{nickname}</div>
												</div>
												<div class="flex item-center">
													{#if content.isAdmin && $modalStore[0].meta.type !== ChannelType.ONETOONE}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => ban(id)}">영구추방</button>
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => kick(id)}">임시추방</button>
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => mute(id)}">음소거</button>
													{/if}
													{#if id !== $userIdStore && !$blockeeStore.some((b) => b.id === id)}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => dispatchBlock(id)}">차단</button>
													{/if}
													<button
														type="button"
														class="btn btn-sm variant-filled hidden group-hover:block"
														on:click="{() => showProfile(id)}"
														>프로필 보기</button>
												</div>
											</div>
										</li>
									{/each}
									<li>영구추방자</li>
									{#each banned as { id, nickname, avatar }, i}
										{#if i !== 0}
											<hr />
										{/if}
										<li>
											<div
												class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
												<div class="flex items-center">
													<Avatar
														src="{avatar}"
														width="w-6"
														rounded="rounded-md" />
													<div class="ml-2">{nickname}</div>
												</div>
												<div class="flex item-center">
													{#if content.isAdmin}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => unban(id)}"
															>영구추방 해제</button>
													{/if}
													<button
														type="button"
														class="btn btn-sm variant-filled hidden group-hover:block"
														on:click="{() => showProfile(id)}"
														>프로필 보기</button>
												</div>
											</div>
										</li>{/each}
								</ul>
							</nav>
						</div>
					</form>
				{:else if tabSet === 2 && content.isOwner}
					<label class="flex items-center cursor-pointer">
						<div class="relative">
							<input
								type="checkbox"
								class="hidden"
								on:change="{toggleAdminSwitch}"
								checked="{adminSwitch}" />
							<div
								class="toggle__line w-8 h-4 bg-gray-400 rounded-full shadow-inner">
							</div>
							<div
								class="toggle__dot absolute w-4 h-4 bg-white rounded-full shadow inset-y-0 left-0">
							</div>
						</div>
						<div class="ml-2 font-medium">참여자/관리자</div>
					</label>
					{#if adminSwitch}
						<form class="modal-form {cForm}">
							<label class="label">
								<span class="font-bold">관리자 이름</span>
								<div
									class="input-group input-group-divider grid-cols-[auto_1fr]">
									<div class="input-group-shim">
										<i class="fa fa-search"></i>
									</div>
									<input
										class="pl-2 py-1.5"
										bind:value="{input}"
										type="search"
										placeholder="Enter the user name..." />
								</div>
							</label>
							<div class="{cUsers}">
								<nav>
									<ul>
										{#each administrators as { id, nickname, avatar }, i}
											{#if i !== 0}
												<hr />
											{/if}
											<li>
												<div
													class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
													<div class="flex items-center">
														<Avatar
															src="{avatar}"
															width="w-6"
															rounded="rounded-md" />
														<div class="ml-2">{nickname}</div>
													</div>
													{#if nickname !== $modalStore[0].meta.owner}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() => removeAdministrator(id)}"
															>관리자제거</button>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								</nav>
							</div>
						</form>
					{:else}
						<form class="modal-form {cForm}">
							<label class="label">
								<span class="font-bold">유저 이름</span>
								<div
									class="input-group input-group-divider grid-cols-[auto_1fr]">
									<div class="input-group-shim">
										<i class="fa fa-search"></i>
									</div>
									<input
										class="pl-2 py-1.5"
										bind:value="{input}"
										type="search"
										placeholder="Enter the user name..." />
								</div>
							</label>
							<div class="{cUsers}">
								<nav>
									<ul>
										{#each normalParticipants as { id, nickname, avatar }, i}
											{#if i !== 0}
												<hr />
											{/if}
											<li>
												<div
													class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
													<div class="flex items-center">
														<Avatar
															src="{avatar}"
															width="w-6"
															rounded="rounded-md" />
														<div class="ml-2">{nickname}</div>
													</div>
													<button
														type="button"
														class="btn btn-sm variant-filled hidden group-hover:block"
														on:click="{() => addAdministrator(id)}"
														>관리자추가</button>
												</div>
											</li>
										{/each}
									</ul>
								</nav>
							</div>
						</form>
					{/if}
				{/if}
			</svelte:fragment>
		</TabGroup>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click="{parent.onClose}"
				>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}

<style>
	input:checked ~ .toggle__line {
		background-color: #48bb78;
	}

	input:checked ~ .toggle__dot {
		transform: translateX(100%);
	}

	.btn-sm {
		font-size: calc(0.5rem + 0.25vw);
		padding: calc(0.15rem + 0.25vw) calc(0.15rem + 0.1vw);
	}
</style>
