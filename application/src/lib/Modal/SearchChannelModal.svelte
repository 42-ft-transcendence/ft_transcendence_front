<script lang='ts'>
    import { modalStore } from '@skeletonlabs/skeleton';
    import { channelIcon } from '$lib/common';
    
    // Props
	/** Exposes parent props to this component. */
	export let parent: any;
    let channels: any[] | undefined;

    let input: string;
    // Form Data
    const formData = {
        name: '',
        password: undefined,
    }
    async function searchChannel() {
        // TODO fuc searchChannel
        // const response = fetch()
        const response = {data:[{name:'public', type:0}, {name:'protected', type:2}, {name:'protected', type:2}, {name:'protected', type:2}]}
        channels = [...response.data]
    }
    function joinChannel() {
        // TODO fuc joinChannel
        console.log("joinChannel")
    }
    function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
            joinChannel()
		}
	}

    // Base Classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
    const cChannels = 'rounded-md w-full max-h-96 p-4 overflow-y-auto';
</script>

{#if $modalStore[0]}
<div class={cBase}>
    <header class={cHeader}>Search a channel</header>
    <form class="modal-form {cForm}">
        <label class="label">
            <span class="font-bold">채널 이름</span>
            <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                <div class="input-group-shim"><i class="fa fa-search" /></div>
                <input class="pl-2 py-1.5" bind:value={input} type="search" placeholder="Enter the channel name..." />
                <button class="variant-filled-secondary hover:brightness-125 active:scale-[95%] active:brightness-90" on:click={searchChannel} >Search</button>
            </div>
        </label>
        {#if channels === undefined}
            <div class="text-center {cChannels}">채널을 검색하세요</div>
        {:else if channels.length === 0}
            <div class="text-center {cChannels}">결과 없음</div>
        {:else}
            <div class={cChannels}>
                <nav class="">
                    <ul>
                    {#each channels as channel, i}
                        {#if i !== 0}
                        <hr>
                        {/if}
                        <li>
                            {#if channel.type !== 2}
                            <div class="group w-full grid grid-cols-[1fr_auto] h-12 p-2 rounded-md hover:bg-surface-400">
                                <div class="flex items-center"><i class="{channelIcon[channel.type]} mr-1" aria-hidden="true" />{channel.name}</div>
                                <button type="button" class="btn btn-sm variant-filled hidden group-hover:block" on:click={joinChannel}>참여</button>
                            </div>
                            {:else}
                            <div class="group w-full grid grid-cols-[1fr_auto_auto] h-12 p-2 rounded-md hover:bg-surface-400">
                                <div class="flex items-center"><i class="{channelIcon[channel.type]} mr-1" aria-hidden="true" />{channel.name}</div>
                                <input 
                                type="password"
                                class="input py-1 px-2 hidden group-hover:block"
                                name="protected"
                                placeholder="Enter password..."
                                bind:value={formData.password}
                                on:keypress={onPromptKeydown}
                                />
                                <button type="button" class="btn btn-sm variant-filled ml-2 hidden group-hover:block" on:click={joinChannel}>참여</button>
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
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
    </footer>
</div>
{/if}