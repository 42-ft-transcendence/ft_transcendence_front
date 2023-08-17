<script lang='ts'>
    import { TabGroup, Tab, modalStore } from '@skeletonlabs/skeleton';
    import { Avatar } from '@skeletonlabs/skeleton';
    import { channelIcon, getCookie } from '$lib/common';
	import { page } from '$app/stores';
    
    // Props
	/** Exposes parent props to this component. */
	export let parent: any;
    // let users: any[] | undefined;

    let input: string;
    let promise = searchUser();
    let tabSet: number = 0;
    // Form Data
    const formData = {
        name: '',
        password: undefined,
    }

    async function searchUser() {
        // TODO fuc searchUser
        // const response = fetch()
        // const response = {data:[{name:'cgim', avatar:"avatar_cgim"}, {name:'sooyokim', avatar:"sooyokim"}]}
        // return response.data;
        return (await fetch(`/api/channels/${$modalStore[0].meta.id}/participants`, {
            headers: {
                'Authorization': `Bearer ${getCookie('JsonWebToken')}`
            }
        })).json();
    }

    function showProfile(name:string): void {
        if ($modalStore[0].response)
            $modalStore[0].response(new CustomEvent('profile',{bubbles:true, detail:name}))
        modalStore.close()
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
<div class={cBase}>
    <header class={cHeader}>채널 정보</header>
    <TabGroup>
        <Tab bind:group={tabSet} name="member" value={0}>정보</Tab>
        <Tab bind:group={tabSet} name="member" value={1}>멤버</Tab>
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
            <div class="grid grid-cols-[auto_1fr] border border-surface-500 space-y-4 rounded-container-token">
                <!-- TODO API 맞춰서 변경 -->
                <div class={cChannelInfoTableHead}>채널 이름</div>
                <div class={cChannelInfoTableBody}>{$modalStore[0].meta.title}</div>
                <div class={cChannelInfoTableHead}>채널 소유자</div>
                <div class={cChannelInfoTableBody}>{$modalStore[0].meta.owner}</div>
                <div class={cChannelInfoTableHead}>타입</div>
                <div class={cChannelInfoTableBody}>{$modalStore[0].meta.type}</div>
                <div class={cChannelInfoTableHead}>생성날짜</div>
                <div class={cChannelInfoTableBody}>{$modalStore[0].meta.createdAt}</div>
            </div>
            {:else}
            <form class="modal-form {cForm}">
                <label class="label">
                    <span class="font-bold">유저 이름</span>
                    <div class="input-group input-group-divider grid-cols-[auto_1fr]">
                        <div class="input-group-shim"><i class="fa fa-search" /></div>
                        <input class="pl-2 py-1.5" bind:value={input} type="search" placeholder="Enter the user name..." />
                    </div>
                </label>
                <div class={cUsers}>
                    <nav>
                        <ul>
                {#await promise}
                    {#each { length: 10 } as _, i }
                    {#if i !== 0}
                        <hr>
                    {/if}
                    <li>
                        <div class="w-full grid grid-cols-[1fr_auto] h-12 p-2">
                            <div class="flex items-center">
                                <div class="placeholder-circle animate-pulse w-6"></div>
                                <div class="ml-2 placeholder animate-pulse w-36"></div>
                            </div>
                            <div class="flex items-center">
                            <div class="placeholder animate-pulse w-12"></div>
                            </div>
                        </div>
                    </li>
                    {/each}
                {:then users}
                    {#each users as { nickname, avatar }, i}
                        {#if i !== 0}
                        <hr>
                        {/if}
                        <li>
                            <div class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
                                <div class="flex items-center">
                                    <Avatar src={avatar} width="w-6" rounded="rounded-md" />
                                    <div class="ml-2">{nickname}</div>
                                </div>
                                <button type="button" class="btn btn-sm variant-filled hidden group-hover:block" on:click={()=>showProfile(nickname)}>프로필 보기</button>
                            </div>
                        </li>
                    {/each}           
                {/await}
                        </ul>
                    </nav>
                </div>
            </form>
            {/if}
        </svelte:fragment>
    </TabGroup>
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
    </footer>
</div>
{/if}