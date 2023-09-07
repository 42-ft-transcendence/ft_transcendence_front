<script lang="ts">
	import { Avatar, FileDropzone } from "@skeletonlabs/skeleton";
	import { redirect } from "@sveltejs/kit";
	import { onMount } from "svelte";

    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
    const regExp = /[, ]/g;
    let preUsername = 'cgim'; //TODO: fetch를 통해서 기본 프로필의 사진 및 유저 이름 불러오기
    let preAvatarImg: string = 'https://cdn.intra.42.fr/users/aea3ad6c49890c62e5135c8620f5b6b5/cgim.jpg';
    let newAvatarImg: string = '';
    let elemInput: HTMLInputElement;
    onMount(() => {
        elemInput = document.querySelector('.dropzone-input'); // FileDropzone component안에 dropzone-input 존재 null 안됨.
    });
    const formData = {
        name: '',
        img: {}
    }
    let files: FileList | undefined;
    function onChangeHandler(e: Event): void {
        const fileReader = new FileReader();
        if (!(files && files[0] !== null))
            return;
        fileReader.readAsDataURL(files[0]);
        formData.img = files[0];
        fileReader.onload = (data) => {
            if (data.target && typeof(data.target.result) === 'string')
                newAvatarImg = data.target.result;
            }
	}
    function resetFile(): void{
        elemInput.value = '';
        newAvatarImg = '';
        formData.img = {};
        files = undefined;
    }
    function setDefault(): void{
        redirect(307 ,"/");
    }
    function handleSubmit(): void {
        // TODO: fetch 성공시 redirect to / else 다시 입력
    }
    function filterKey(e: Event & {target: HTMLTextAreaElement}):void {
        formData.name = formData.name.replace(regExp,'');
    }
</script>
<div class="w-full h-full flex items-center justify-center"> 
	<div class="card card-hover bg-initial w-3/5 ">
		<header class="card-header">회원가입</header>
		<section class="p-4 space-y-2 flex flex-col justify-center">
            <form class={cForm}>
                <h2>기본 프로필</h2>
                <ul class="list">
                    <li class="p-2 bg-surface-500/50"><Avatar src={newAvatarImg !== "" ? newAvatarImg: preAvatarImg}></Avatar><span>{formData.name === '' ? preUsername: formData.name}</span></li>
                </ul>
                <label class="label">
                    <span>이름 변경</span>
				    <input class="input pl-2 py-1" type="text" bind:value={formData.name} maxlength="10" placeholder="Enter name..." />
                </label>
                <div class="label">
                    <span>사진 변경</span>
                    <FileDropzone class={files ? "hidden":""} name="files" accept="image/jpeg, image/png" on:change={onChangeHandler} bind:files={files} >
                        <svelte:fragment slot="lead"><i class="fa fa-upload fa-2x" aria-hidden="true"></i></svelte:fragment>
                        <svelte:fragment slot="meta">PNG and JPG allowed.</svelte:fragment>
                    </FileDropzone>
                    {#if files}
                        <div class="flex space-x-2"><div>{files[0].name}</div><button on:click|stopPropagation={resetFile}><i class="fa fa-times" aria-hidden="true"></i></button></div>
                    {/if}
                </div>
            </form>
		</section>
        <footer class="card-footer flex justify-end space-x-2">
            <button type="button" class="btn variant-ghost-surface" on:click={setDefault}>기본값으로 설정</button>
            <button type="button" class="btn variant-filled" on:click={handleSubmit}>변경하기</button>
        </footer>
	</div>
</div>