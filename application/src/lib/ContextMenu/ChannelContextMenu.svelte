<script lang='ts'>
    import { ContextMenu } from '$lib/ContextMenu/ContextMenu';

    export let pointerEvent: MouseEvent;
    const contextmenu = new ContextMenu();
    $: { 
        contextmenu.rightClickContextMenu(pointerEvent);
        contextmenu.pos.x = contextmenu.pos.x
        contextmenu.pos.y = contextmenu.pos.y
    }
    function leaveChannel(){
        console.log("remove item...")
    }
    let menuItems = [
        {
            'name': 'leave channel',
            'onClick': leaveChannel,
            'displayText': "채널 나가기",
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
