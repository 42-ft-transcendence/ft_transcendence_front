<script lang="ts">
	import { goto } from '$app/navigation';
	import { BaseUrl, JWT_DB_KEY, hasCookie, printError } from '$lib/common';
	import { getRequestApi, postRequestApi } from '$lib/fetch';
	import { onMount } from 'svelte';

	let codeInput: string;

	onMount(async () => {
		if (!hasCookie(JWT_DB_KEY)) await goto('/login', { replaceState: true });
		try {
			const { refresh } = await getRequestApi(
				BaseUrl.USERS + 'twoFactorSetting',
			);
			if (!refresh) await goto('/', { replaceState: true });
		} catch (err: any) {
			printError(err);
		}
	});

	async function authenticate() {
		try {
			await postRequestApi(BaseUrl.AUTH + 'otp/authenticate', {
				otpCode: codeInput,
			});
			await goto('/', { replaceState: true }); //TODO: 에러가 발생했을 때 `/` 링크로 이동하지 않는지 확인하기
		} catch (error: any) {
			codeInput = '';
			printError(error);
		}
	}
</script>

<section class="bg-ct-blue-600 min-h-screen grid place-items-center">
	<div class="w-full">
		<h1 class="text-lg text-center mb-4 text-ct-dark-200">2단계 인증하기</h1>
		<form
			on:submit="{authenticate}"
			class="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5">
			<input
				class="form-control block w-full px-4 py-4 text-sm text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
				placeholder="Authentication Code"
				bind:value="{codeInput}" />
			<div class="flex item-center">
				<button type="submit" class="text-ct-blue-600"> Authenticate </button>
			</div>
		</form>
	</div>
</section>
