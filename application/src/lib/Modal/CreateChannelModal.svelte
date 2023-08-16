<script lang='ts'>
    import { redirect } from '@sveltejs/kit';
    import { modalStore } from '@skeletonlabs/skeleton';
    import { channelIcon } from '$lib/common';
	import { getCookie } from '../common';
    
    // Props
	/** Exposes parent props to this component. */
	export let parent: any;

    // Form Data
    const formData = {
        name: '',
        type: 'PUBLIC',
        password: undefined, //TODO consider security problems.
    }

    async function onFormSubmit() {
        //TODO check channel is a unique name?
        try {
            const newChannel = await fetch('http://localhost:8080/api/channels', {
                method: "POST",
                mode: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('JsonWebToken')}`,
                },
                body: JSON.stringify(formData),
            });
            console.log(newChannel);        
        } catch (err) {
            console.log(err);
        }
        // throw redirect(301, `/chat/${newChannel.body.id}`);
    }

    const channelTypes = [{name: 'PUBLIC', description: '사용자 누구나 가입할 수 있음'}, 
                        {name: 'PRIVATE', description: '초대를 통해서만 가입할 수 있음'}, 
                        {name: 'PROTECTED', description: '비밀번호를 통해 가입할 수 있음'}]

    // Base Classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
//TODO: make enum for channel type and use it instead of raw string.
</script>
{#if $modalStore[0]}
<div class={cBase}>
    <header class={cHeader}>Create a channel</header>
    <form class="modal-form {cForm}">
        <label class="label">
            <span>Channel Name</span>
            <input class="input py-2 px-3" type="search" bind:value={formData.name} placeholder="Enter channel name..." />
        </label>
        <lable class="label">
            <span>Channel Type</span>
            {#each channelTypes as channelType, i}
            <div class="pl-2">
                <input
			    type="radio"
			    name="channelType"
			    value={channelTypes[i].name}
                bind:group={formData.type}
		        />
                <i class={channelIcon[i]} aria-hidden="true" />
                &nbsp;{channelType.name}<br>
                <span class="text-sm pl-6 font-light">{channelType.description}</span>
            </div>
            {/each}
            <input
            class="input py-1 px-2 w-2/5 ml-6 {formData.type !== 'PROTECTED' ? 'hidden': ''}"
            type="password"
            name="protected"
            placeholder="Enter password..."
            disabled={formData.type !== 'PROTECTED'}
            bind:value={formData.password}
            />
        </lable>
    </form>
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create</button>
    </footer>
</div>
{/if}