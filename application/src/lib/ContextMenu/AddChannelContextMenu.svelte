<script lang='ts'>
    import { ContextMenu } from '$lib/ContextMenu/ContextMenu';
    import { modalStore, type ModalSettings, type ModalComponent, Modal } from '@skeletonlabs/skeleton';
    import CreateChannelModal from '$lib/Modal/CreateChannelModal.svelte';
    import SearchChannelModal from '$lib/Modal/SearchChannelModal.svelte';

    export let pointerEvent: MouseEvent;
    const contextmenu = new ContextMenu();
    $: { 
        contextmenu.rightClickContextMenu(pointerEvent);
        contextmenu.pos.x = contextmenu.pos.x
        contextmenu.pos.y = contextmenu.pos.y
    }

    const createChannelModalComponent: ModalComponent = {
        ref: CreateChannelModal
    };

    const searchChannelModalComponent: ModalComponent = {
        ref: SearchChannelModal
    }

    function createChannel(){
        const modal: ModalSettings = {
            type: 'component',
            component: createChannelModalComponent
        };
        modalStore.trigger(modal);
    }
    function searchChannel(){
        const modal: ModalSettings = {
            type: 'component',
            component: searchChannelModalComponent
        };
        modalStore.trigger(modal);
    }
    let menuItems = [
        {
            'name': 'create channel',
            'onClick': createChannel,
            'displayText': "채널 생성",
            'class': ''
        },
        {
            'name': 'search channel',
            'onClick': searchChannel,
            'displayText': "채널 찾기",
            'class': ''
        },
    ]
</script>


<nav use:contextmenu.getContextMenuDimension class="bg-tertiary-100-800-token shadow-2xl border border-surface-500/30 z-50 rounded-lg"  style="position: absolute; top:{contextmenu.pos.y}px; left:{contextmenu.pos.x}px">
    <div class="navbar" id="navbar">
        <ul>
            {#each menuItems as item, i}
                <li><button class="text-left w-full p-2 hover:bg-surface-300 { menuItems.length == 1 ? 'rounded-lg': i == 0 ? 'rounded-t-lg': menuItems.length - 1 == i ? 'rounded-b-lg' : ''}" on:click={item.onClick}><i class={item.class}></i>{item.displayText}</button></li>
                {#if menuItems.length !== i + 1}
                <hr>
                {/if}
            {/each}
        </ul>
    </div>
</nav>
