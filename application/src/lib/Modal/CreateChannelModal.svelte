<script lang='ts'>
    import { modalStore } from '@skeletonlabs/skeleton';
    import { channelIcon } from '$lib/common';
    
    // Props
	/** Exposes parent props to this component. */
	export let parent: any;

    // Form Data
    const formData = {
        name: '',
        type: 0,
        password: undefined, //TODO consider security problems.
    }

    function onFormSubmit() {
        //TODO check channel is a unique name?
        console.log(formData)
        console.log("onFormSubmit")
    }

    const channelTypes = [{name: 'Public', description: '사용자 누구나 가입할 수 있음'}, 
                        {name: 'Private', description: '초대를 통해서만 가입할 수 있음'}, 
                        {name: 'Protected', description: '비밀번호를 통해 가입할 수 있음'}]

    // Base Classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'flex flex-col border border-surface-500 p-4 space-y-4 rounded-container-token';
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
			    value={i}
                bind:group={formData.type}
		        />
                <i class={channelIcon[i]} aria-hidden="true" />
                &nbsp;{channelType.name}<br>
                <span class="text-sm pl-6 font-light">{channelType.description}</span>
            </div>
            {/each}
            <input
            class="input py-1 px-2 w-2/5 ml-6 {formData.type !== 2 ? 'hidden': ''}"
            type="password"
            name="protected"
            placeholder="Enter password..."
            disabled={formData.type !== 2}
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