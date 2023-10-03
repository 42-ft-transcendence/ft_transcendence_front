<script lang="ts">
	import { BaseUrl, printError } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { MatchHistoryDetail } from '$lib/type';
	import {
		Table,
		modalStore,
		type TableSource,
		tableMapperValues,
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	const userId: number = $modalStore[0].meta.userId;

	let matchHistoryDetail: MatchHistoryDetail[] = [];
	$: tableData = matchHistoryDetail.map((d) => {
		const date = new Date(d.matchAt);
		return {
			avatar: `<img src="${
				d.winnerId === userId ? d.loser.avatar : d.winner.avatar
			}" class="avatar-image rounded-full w-10" />`,
			nickname: d.winnerId === userId ? d.loser.nickname : d.winner.nickname,
			map: d.mapType,
			result: d.winnerId === userId ? '승' : '패',
			date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
		};
	});

	$: tableSource = {
		head: ['아바타', '닉네임', '맵', '승패', '날짜'],
		body: tableMapperValues(tableData, [
			'avatar',
			'nickname',
			'map',
			'result',
			'date',
		]),
		foot: ['Total', '', `<code class="code">${tableData.length}</code>`],
	};

	onMount(async () => {
		try {
			matchHistoryDetail = await getRequestApi(
				BaseUrl.MATCHES + `${userId}/detail`,
			);
			matchHistoryDetail = [...matchHistoryDetail];
		} catch (err: any) {
			printError(err);
		}
	});

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
	const cUsers = 'rounded-md w-full max-h-96 p-4 overflow-y-auto';
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">Match History</header>
		<hr />
		<!-- <ul>
			<li>
				<div
					class="group w-full grid grid-cols-[auto_1fr_auto_1fr_1fr] h-12 p-2 rounded-md hover:bg-surface-400 ">
				</div>
			</li>
			{#each details as detail, i}
			{#if i !== 0}
				<hr />
			{/if}
			<li>
				<div
					class="group w-full grid grid-cols-[auto_1fr_auto_1fr_1fr] h-12 p-2 rounded-md hover:bg-surface-400">
					<Avatar
					class="no-pointer-event"
					src="{detail.avatar}"
					width="w-6"
					rounded="rounded-md" />
				<div class="ml-2 no-pointer-event">
					{detail.nickname}
				</div>
				<div class="ml-2 no-pointer-event">
					{detail.result}
				</div>
				<div class="ml-2 no-pointer-event">
					{detail.map}
				</div>
				<div class="ml-2 no-pointer-event">
					{detail.date}
				</div>
				</div>
			</li>
			{/each}
		</ul> -->
		<Table source="{tableSource}" />
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click="{parent.onClose}"
				>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}
