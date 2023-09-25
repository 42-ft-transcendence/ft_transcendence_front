<script lang="ts">
	import { BaseUrl, printOrRethrow } from '$lib/common';
	import { postRequestApi } from '$lib/fetch';
	import { twoFactorAuthStore } from '$lib/store';
	import { modalStore } from '@skeletonlabs/skeleton';
	
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	let codeInput: string;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	async function disable2FA() {
		try {
			await postRequestApi(
				BaseUrl.AUTH + 'otp/disable', { otpCode: codeInput },
			);
			twoFactorAuthStore.update((store) => false);
			modalStore.close();
		} catch (error: any) {
			printOrRethrow(error);
		}
	}
</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">2단계 인증 비활성화</header>
		<div class="grid gap-y-4">
			<hr />
			<form on:submit="{disable2FA}">
				<div class="flex justify-center">
					<input
						class="flex bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5"
						placeholder="Authentication Code"
						bind:value="{codeInput}" />
				</div>
				<div
					class="flex justify-end items-center py-6 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
					<button
						type="button"
						class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
						on:click="{parent.onClose}">{parent.buttonTextCancel}</button>
					<button
						type="submit"
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
						Verify & Activate
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
