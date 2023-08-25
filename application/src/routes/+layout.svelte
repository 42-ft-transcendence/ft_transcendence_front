<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/Sidebar/Navigation.svelte';
	import Profile from '$lib/Sidebar/Profile.svelte';
	import { Modal } from '@skeletonlabs/skeleton';
	
	export let data;
	let register = data.register;
	let sidebarLeftBtn = false;
	let sidebarRightBtn = false;
	let username:string;

	function handleProfileEvent(e:any){
		sidebarRightBtn = true;
		username = e.detail;
	}
	function handleMyProfile(){
		sidebarRightBtn = true;
		username = 'cgim' // TODO fix username
	}
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				{#if register}
				<button class="invisible sm:visible" on:click={() => sidebarLeftBtn=!sidebarLeftBtn}>
					<i class="fa fa-bars fa-lg" aria-hidden="true"></i>
				</button>
				{/if}
			</svelte:fragment>
			<b>PonGo</b>
			<svelte:fragment slot="trail">
				<LightSwitch /> <!-- TODO this will be changed for OS mode-->
				{#if register}
				<button on:click={handleMyProfile}><i class="fa fa-user-circle-o fa-lg" aria-hidden="true"></i></button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if register}
		<Navigation {sidebarLeftBtn} {data}/>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		{#if register}
		<Profile {sidebarRightBtn} {username} on:closeSidebarRight={()=>sidebarRightBtn=false}/>
		{/if}
	</svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<div class="h-full" on:profile={handleProfileEvent}>
	<slot />
	</div>
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>