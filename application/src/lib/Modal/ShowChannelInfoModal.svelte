<script lang="ts">
	import { TabGroup, Tab, modalStore } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { BaseUrl } from '$lib/common';
	import { deleteRequestApi, getRequestApi, postRequestApi } from '$lib/fetch';
	import { onMount } from 'svelte';

	//TODO: 관리자에 대한 ban, kick, mute 가능해야 하나? nono

	type User = {
		id: number;
		nickname: string;
		avatar: string;
	};

	type Content = {
		isOwner: boolean;
		participants: {
			user: User;
		}[];
		administrators: {
			user: User;
		}[];
	};

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	let participants: User[] = [];
	let administrators: User[] = [];
	let normalParticipants: User[] = [];
	let content: Content = { isOwner: false, participants: [], administrators: [] };

	let adminSwitch = true;

	let input: string; //TODO: 여러 구성 요소에서 동일한 변수인 input을 사용자의 입력을 받는데 사용하면 해당 구성 요소들 중 하나에 값을 입력했을 때 모든 구성 요소에 동일한 내용이 표시된다. 구성 요소마다 서로 다른 변수를 사용하도록 하자.
	let tabSet: number = 0;
	// Form Data
	const formData = {
		name: '',
		password: undefined
	};

	onMount(async () => {
		content = await getRequestApi(BaseUrl.CHANNELS + `${$modalStore[0].meta.id}/contents`);
		participants = content.participants.map((p) => p.user);
		administrators = content.administrators.map((a) => a.user);
		normalParticipants = participants.filter(
			(p) => !administrators.some((a) => a.nickname === p.nickname)
		);
	});

	function toggleAdminSwitch() {
		adminSwitch = !adminSwitch;
	}

	function showProfile(name: string): void {
		if ($modalStore[0].response)
			$modalStore[0].response(new CustomEvent('profile', { bubbles: true, detail: name }));
		modalStore.close();
	}
	//TODO: authorization "owner"
	async function addAdministrator(id: number) {
		const admin = await postRequestApi(BaseUrl.ADMINISTRATORS, {
			channelId: $modalStore[0].meta.id,
			userId: id
		});
		console.log(admin);
		administrators = [...administrators, admin];
		normalParticipants = participants.filter(
			(p) => !administrators.some((a) => a.nickname === p.nickname)
		);
	}
	//TODO: authorization "owner"
	async function removeAdministrator(user: User) {
		const removed = await deleteRequestApi(
			BaseUrl.ADMINISTRATORS + `channelId/${$modalStore[0].meta.id}/userId/${user.id}`
		);
		console.log(removed);
		administrators = administrators.filter((a) => a.id != user.id);
		normalParticipants = [...normalParticipants, user];
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
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
			{#if content.isOwner}
				<Tab bind:group="{tabSet}" name="member" value="{2}">관리</Tab>
			{/if}
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<div
						class="grid grid-cols-[auto_1fr] border border-surface-500 space-y-4 rounded-container-token">
						<!-- TODO API 맞춰서 변경 -->
						<div class="{cChannelInfoTableHead}">채널 이름</div>
						<div class="{cChannelInfoTableBody}">{$modalStore[0].meta.title}</div>
						<div class="{cChannelInfoTableHead}">채널 소유자</div>
						<div class="{cChannelInfoTableBody}">{$modalStore[0].meta.owner}</div>
						<div class="{cChannelInfoTableHead}">타입</div>
						<div class="{cChannelInfoTableBody}">{$modalStore[0].meta.type}</div>
						<div class="{cChannelInfoTableHead}">생성날짜</div>
						<div class="{cChannelInfoTableBody}">{$modalStore[0].meta.createdAt}</div>
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
									{#each participants as { id, nickname, avatar }, i}
										{#if i !== 0}
											<hr />
										{/if}
										<li>
											<div
												class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
												<div class="flex items-center">
													<Avatar src="{avatar}" width="w-6" rounded="rounded-md" />
													<div class="ml-2">{nickname}</div>
												</div>
												<button
													type="button"
													class="btn btn-sm variant-filled hidden group-hover:block"
													on:click="{() => showProfile(nickname)}">프로필 보기</button>
											</div>
										</li>
									{/each}
								</ul>
							</nav>
						</div>
					</form>
				{:else if tabSet === 2 && content.isOwner}
					<label class="flex items-center cursor-pointer">
						<div class="relative">
							<input type="checkbox" class="hidden" on:change="{toggleAdminSwitch}" />
							<div class="toggle__line w-8 h-4 bg-gray-400 rounded-full shadow-inner"></div>
							<div
								class="toggle__dot absolute w-4 h-4 bg-white rounded-full shadow inset-y-0 left-0">
							</div>
						</div>
						<div class="ml-3 font-medium">참여자/관리자 토글</div>
					</label>
					{#if adminSwitch}
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
										{#each normalParticipants as { id, nickname, avatar }, i}
											{#if i !== 0}
												<hr />
											{/if}
											<li>
												<div
													class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
													<div class="flex items-center">
														<Avatar src="{avatar}" width="w-6" rounded="rounded-md" />
														<div class="ml-2">{nickname}</div>
													</div>
													<button
														type="button"
														class="btn btn-sm variant-filled hidden group-hover:block"
														on:click="{() => addAdministrator(id)}">관리자추가</button>
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
								<span class="font-bold">관리자 이름</span>
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
										{#each administrators as { id, nickname, avatar }, i}
											{#if i !== 0}
												<hr />
											{/if}
											<li>
												<div
													class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
													<div class="flex items-center">
														<Avatar src="{avatar}" width="w-6" rounded="rounded-md" />
														<div class="ml-2">{nickname}</div>
													</div>
													{#if nickname !== $modalStore[0].meta.nickname}
														<button
															type="button"
															class="btn btn-sm variant-filled hidden group-hover:block"
															on:click="{() =>
																removeAdministrator({
																	id: id,
																	nickname: nickname,
																	avatar: avatar
																})}">관리자제거</button>
													{/if}
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
</style>
