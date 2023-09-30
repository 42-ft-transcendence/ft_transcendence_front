<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { BaseUrl, channelIcon, socket } from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import type { UserProfile } from '$lib/type';

	export let parent: any;

	const formData = { type: 'NORMAL' };

	async function onFormSubmit() {
		const user: UserProfile = await getRequestApi(`${BaseUrl.USERS}/oneself`);
		socket.emit('invite', {
			userName: user.nickname,
			mapType: formData.type,
			opponentId: $modalStore[0].meta.opponentId,
		});
		modalStore.close();
	}

	const mapTypes = [{ type: 'NORMAL' }, { type: 'FAST' }];

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">Select Map</header>
		<form class="modal-form {cForm}">
			<lable class="label">
				<span>Map Type</span>
				{#each mapTypes as mapType, i}
					<div class="pl-2">
						<input
							type="radio"
							name="mapTypes"
							value="{mapType.type}"
							bind:group="{formData.type}" />
						<i
							class="{channelIcon[mapType.type]} inline-block w-8"
							aria-hidden="true"></i
						>{mapType.type}<br />
					</div>
				{/each}
			</lable>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click="{parent.onClose}"
				>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click="{onFormSubmit}"
				>Invite</button>
		</footer>
	</div>
{/if}
