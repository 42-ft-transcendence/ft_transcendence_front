<script lang="ts">
	import { goto } from '$app/navigation';
	import { BaseUrl, JWT_OAUTH_KEY, getCookie } from '$lib/common';
	import { Avatar, FileDropzone } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	interface FormData {
		nickname: string;
		avatar: File | undefined;
	};

	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';
	const regExp = /[, ]/g;
	
	const formData: FormData = { nickname: '', avatar: undefined };
	
	let preview: string | undefined;
	let elemInput: HTMLInputElement;
	let files: FileList | undefined;
	
	onMount(() => {
		elemInput = document.querySelector('.dropzone-input') as HTMLInputElement; // FileDropzone component안에 dropzone-input 존재 null 안됨.
	});

	function onChangeHandler(e: Event): void {
		const fileReader = new FileReader();
		if (!(files && files[0] !== null)) return;
		fileReader.readAsDataURL(files[0]);
		formData.avatar = files[0];
		fileReader.onload = (data) => {
			if (data.target && typeof data.target.result === 'string')
				preview = data.target.result;
		};
	}
	function resetFile(): void {
		elemInput.value = '';
		preview = '';
		formData.avatar = undefined;
		files = undefined;
	}
	async function postRequestApiSignup(url: string, payload: any, contentType: string) {
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': contentType,
				Authorization: `Bearer ${getCookie(JWT_OAUTH_KEY)}`,
			},
			body: JSON.stringify(payload),
		});
	}
	async function setDefault() {
		// create user in database
		await postRequestApiSignup(BaseUrl.USERS + 'defaultAvatar', {}, 'application/json');
		// delete JWTOauth cookie -> do this in nestjs interceptor
		//TODO: handling 409 conflict exception -> print error message on screen;
		// redirect to '/'
		goto('/');
	}
	async function handleSubmit() {
		// create user in database
		const { nickname, avatar } = formData;
		if (formData.avatar)
			await postRequestApiSignup(BaseUrl.USERS + 'customAvatar', { nickname: nickname === '' ? undefined : nickname, avatar: avatar }, 'multipart/form-data');
		else
			await postRequestApiSignup(BaseUrl.USERS + 'defaultAvatar', { nickname: nickname === '' ? undefined : nickname }, 'application/json');
		// delete JWTOauth cookie -> do this in nestjs interceptor

		// redirect to '/'
		// TODO: fetch 성공시 redirect to / else 다시 입력
		goto('/');
	}
	function filterKey(e: Event & { target: HTMLTextAreaElement }): void {
		formData.nickname = formData.nickname.replace(regExp, '');
	}
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="card card-hover bg-initial w-3/5">
		<header class="card-header">회원가입</header>
		<section class="p-4 space-y-2 flex flex-col justify-center">
			<form class="{cForm}">
				<div class="label">
					<span>프로필 이미지</span>
					<Avatar class="w-3/12 m-auto" src="{preview}" />
				</div>
				<label class="label">
					<span>이름 변경</span>
					<input
						class="input pl-2 py-1"
						type="text"
						bind:value="{formData.nickname}"
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
						<svelte:fragment slot="meta">PNG and JPG allowed.</svelte:fragment>
					</FileDropzone>
					{#if files}
						<div class="flex space-x-2">
							<div>{files[0].name}</div>
							<button on:click|stopPropagation="{resetFile}"
								><i class="fa fa-times" aria-hidden="true"></i></button>
						</div>
					{/if}
				</div>
			</form>
		</section>
		<footer class="card-footer flex justify-end space-x-2">
			<button
				type="button"
				class="btn variant-ghost-surface"
				on:click="{setDefault}">기본값으로 설정</button>
			<button type="button" class="btn variant-filled" on:click="{handleSubmit}"
				>변경하기</button>
		</footer>
	</div>
</div>
