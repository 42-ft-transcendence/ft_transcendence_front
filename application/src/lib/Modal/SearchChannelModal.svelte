<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { BaseUrl, dateReviver, channelIcon, loadPage, socket, printOrRethrow } from '$lib/common';
	import { channelUserInStore } from '$lib/store';
	import { get } from 'svelte/store';
	import { getRequestApi, postRequestApi } from '$lib/fetch';
	import { ChannelType } from '$lib/type';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	let searchResult: any[] | undefined;

	let userChannelIds: number[];

	channelUserInStore.subscribe(() => {
		userChannelIds = get(channelUserInStore).map((channel) => channel.id);
		if (searchResult)
			searchResult = searchResult.filter(
				(channel) => !userChannelIds.includes(channel.id),
			);
	});

	let input: string | undefined;
	// Form Data
	const formData = {
		name: '',
		password: undefined,
	};

	async function searchChannel() {
		searchResult = await getRequestApi(
			BaseUrl.CHANNELS +
				(input ? `name/?type=GROUP&partialName=${input}` : '?type=GROUP'),
		);
		if (searchResult)
			searchResult = searchResult.filter(
				(channel) => !userChannelIds.includes(channel.id),
			);
		input = undefined;
	}

	async function joinChannel(event: MouseEvent | KeyboardEvent) {
		const button = event.target as HTMLButtonElement;
		const channelId = parseInt(button.dataset.channelId as string);

		try {
			const newChannel = await postRequestApi(BaseUrl.PARTICIPANTS, {
				channelId: channelId,
			});
			modalStore.close();
			const dateChannel = JSON.parse(JSON.stringify(newChannel), dateReviver);
			socket.emit('create Channel', dateChannel);
			loadPage(dateChannel.id);
		} catch (error: any) {
			printOrRethrow(error);
		}
	}

	async function joinProtectedChannel(channelId: number) {
		try {
			const newChannel = await postRequestApi(BaseUrl.PARTICIPANTS, {
				channelId: channelId,
				channelPassword: formData.password,
			});
			const dateChannel = JSON.parse(JSON.stringify(newChannel), dateReviver);
			modalStore.close();
			socket.emit('create Channel', dateChannel);
			loadPage(dateChannel.id);
		} catch (error: any) {
			formData.password = undefined;
			printOrRethrow(error);
		}
	}

	function onPromptKeydown(event: KeyboardEvent, channelId: number): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			joinProtectedChannel(channelId);
		}
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
	const cChannels = 'rounded-md w-full max-h-96 p-4 overflow-y-auto';
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">Search a channel</header>
		<form class="modal-form {cForm}">
			<label class="label">
				<span class="font-bold">채널 이름</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><i class="fa fa-search"></i></div>
					<input
						class="pl-2 py-1.5"
						bind:value="{input}"
						type="search"
						placeholder="Enter the channel name..." />
					<button
						class="variant-filled-secondary hover:brightness-125 active:scale-[95%] active:brightness-90"
						on:click="{searchChannel}">Search</button>
				</div>
			</label>
			{#if searchResult === undefined}
				<div class="text-center {cChannels}">채널을 검색하세요</div>
			{:else if searchResult.length === 0}
				<div class="text-center {cChannels}">결과 없음</div>
			{:else}
				<div class="{cChannels}">
					<nav class="">
						<ul>
							{#each searchResult as channel, i}
								{#if i !== 0}
									<hr />
								{/if}
								<li>
									{#if channel.type !== ChannelType.PROTECTED}
										<div
											class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
											<div class="flex items-center">
												<i
													class="{channelIcon[
														channel.type
													]} inline-block w-8 mr-1"
													aria-hidden="true"></i
												>{channel.name}
											</div>
											<button
												type="button"
												class="btn btn-sm variant-filled hidden group-hover:block"
												data-channel-id="{channel.id}"
												on:click="{joinChannel}">참여</button>
										</div>
									{:else}
										<div
											class="group w-full grid grid-cols-[1fr_auto_auto] h-12 p-2 rounded-md hover:bg-surface-400">
											<div class="flex items-center">
												<i
													class="{channelIcon[
														channel.type
													]} inline-block w-8 mr-1"
													aria-hidden="true"></i
												>{channel.name}
											</div>
											<input
												type="password"
												class="input py-1 px-2 hidden group-hover:block"
												name="protected"
												placeholder="Enter password..."
												bind:value="{formData.password}"
												on:keypress="{(e) => onPromptKeydown(e, channel.id)}" />
											<button
												type="button"
												class="btn btn-sm variant-filled ml-2 hidden group-hover:block"
												data-channel-id="{channel.id}"
												on:click="{() => joinProtectedChannel(channel.id)}"
												>참여</button>
										</div>
									{/if}
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
