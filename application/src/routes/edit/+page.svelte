<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		BaseUrl,
		JWT_DB_KEY,
		JWT_OAUTH_KEY,
		getCookie,
		hasCookie,
		printError,
	} from '$lib/common';
	import { getRequestApi } from '$lib/fetch';
	import {
		activateProfile,
		deactivateProfile,
		profileIdStore,
		userIdStore,
	} from '$lib/store';
	import type { UserProfile } from '$lib/type';
	import {
		Avatar,
		FileDropzone,
		ProgressRadial,
		toastStore,
	} from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';

	interface UserInput {
		nickname: string;
		avatar: File | undefined;
	}

	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';
	const regExp = /[, ]/g;

	const userInput: UserInput = { nickname: '', avatar: undefined };
	let reloadFlag: boolean;
	// const controller = new AbortController();

	let userProfile: UserProfile;
	let preview: string | undefined;
	let elemInput: HTMLInputElement;
	let files: FileList | undefined;

	onMount(async () => {
		reloadFlag = true;
		elemInput = document.querySelector('.dropzone-input') as HTMLInputElement; // FileDropzone component안에 dropzone-input 존재 null 안됨.
		if (!hasCookie(JWT_DB_KEY)) await goto('/', { replaceState: true });
		else {
			try {
				userProfile = await getRequestApi(BaseUrl.USERS + $userIdStore);
				preview = userProfile.avatar;
			} catch (err: any) {
				printError(err);
			}
		}
	});

	function onChangeHandler(e: Event): void {
		const fileReader = new FileReader();
		if (!(files && files[0] !== null)) return;
		fileReader.readAsDataURL(files[0]);
		userInput.avatar = files[0];
		fileReader.onload = (data) => {
			if (data.target && typeof data.target.result === 'string')
				preview = data.target.result;
		};
	}

	function resetFile(): void {
		if (elemInput) elemInput.value = '';
		preview = userProfile.avatar;
		userInput.avatar = undefined;
		files = undefined;
	}

	async function fetchEditApi(url: string, payload: any, avatarFlag: boolean) {
		reloadFlag = false;
		let headers: HeadersInit = {
			Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
		};
		if (avatarFlag) headers[`${'Content-Type'}`] = 'application/json';
		const result = await fetch(url, {
			method: 'PATCH',
			headers: headers,
			body: payload,
		});
		if (result.ok) {
			await goto('/', { replaceState: true });
			location.reload();
		} else {
			reloadFlag = true;
			const body = await result.json();
			toastStore.trigger({
				message: body.message,
				background: 'variant-filled-warning',
				hideDismiss: true,
				timeout: 2000,
			});
			await goto('/edit', { replaceState: true });
		}
	}

	function goBack() {
		window.history.back();
	}

	async function handleSubmit() {
		const { nickname, avatar } = userInput;
		try {
			if (avatar) {
				const formData = new FormData();
				if (nickname) formData.append('nickname', nickname);
				formData.append('avatar', avatar);
				await fetchEditApi(BaseUrl.USERS + 'updateProfile', formData, false);
			} else
				await fetchEditApi(
					BaseUrl.USERS + 'updateNickname',
					JSON.stringify({ nickname: nickname }),
					true,
				);
		} catch (err: any) {
			printError(err);
		}
	}
</script>

<svelte:window
	on:beforeunload="{(event) => {
		if (!reloadFlag) {
			event.preventDefault();
			event.returnValue = '';
			return '';
		}
		// controller.abort();
	}}" />

<div class="w-full h-full flex items-center justify-center">
	<div class="card card-hover bg-initial w-3/5">
		<header class="card-header">정보 수정</header>
		<section class="p-4 space-y-2 flex flex-col justify-center">
			<form class="{cForm}">
				{#if reloadFlag}
					<div class="label">
						<span>프로필 이미지</span>
						<Avatar class="w-3/12 m-auto" src="{preview}" />
					</div>
					<label class="label">
						<span>이름 변경</span>
						<input
							class="input pl-2 py-1"
							type="text"
							bind:value="{userInput.nickname}"
							maxlength="10"
							placeholder="Enter name..." />
					</label>
					<div class="label">
						<span>사진 변경</span>
						<FileDropzone
							class="{files ? 'hidden' : ''}"
							name="files"
							accept="image/jpeg, image/png"
							on:change="{onChangeHandler}"
							bind:files="{files}">
							<svelte:fragment slot="lead"
								><i class="fa fa-upload fa-2x" aria-hidden="true"></i
								></svelte:fragment>
							<svelte:fragment slot="meta"
								>PNG and JPG allowed.</svelte:fragment>
						</FileDropzone>
						{#if files}
							<div class="flex space-x-2">
								<div>{files[0].name}</div>
								<button on:click|stopPropagation="{resetFile}"
									><i class="fa fa-times" aria-hidden="true"></i></button>
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex justify-center items-center">
						<ProgressRadial ... stroke="{50}" width="w-3/12" />
					</div>
				{/if}
			</form>
		</section>
		{#if reloadFlag}
			<footer class="card-footer flex justify-end space-x-2">
				<button type="button" class="btn variant-filled" on:click="{goBack}"
					>뒤로가기</button>
				<button
					type="button"
					class="btn variant-filled"
					on:click="{handleSubmit}">수정하기</button>
			</footer>
		{/if}
	</div>
</div>
