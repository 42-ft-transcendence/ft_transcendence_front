<script lang='ts'>
	import { ProgressRadial, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Game from '$lib/Game/Game.svelte';
	import { socket } from '$lib/common';

	let state:string = '';
	let gameType:string | undefined;
	let pageElement: HTMLElement | null;

	const gameCards: {img: string, gameName:string, gameType:string}[] = [
		{img: 'http/gif', gameName:'일반 게임', gameType:'normal'},
		{img: 'http/gif', gameName:'스피드 게임', gameType:'speed'},
	];

	onMount(() => {
		pageElement = document.querySelector('#page');
		pageElement?.classList.add('h-screen');
		socket.emit('get UserState', (userState:string) => {
			state = userState;
		});
		return () => {
			pageElement?.classList.remove('h-screen');
		};
	});

	function waitingGame() {
		if (gameType === undefined){
			const t: ToastSettings = {
				message: '게임을 선택해 주세요.',
				hideDismiss: true,
				timeout: 2000
			};
			toastStore.trigger(t);
			return ;
		}
		state = 'waiting';
	};

	function changeGameType(type:string){
		gameType = type;
		//state 확인
		//socket.emit
	}
	
	const cCard = 'snap-start shrink-0 card card-hover py-20 w-40 md:w-80 text-center';
</script>

<div class="gamePage flex flex-col h-[90vh] justify-center items-center {state === 'gamming' ? 'bg-zinc-700': ''}">
{#if state === 'waiting'}
<div class="flex flex-col items-center p-4 space-y-2" transition:fade>
<ProgressRadial stroke={50} meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20"/>
<p class="text-primary-500">상대를 찾는 중</p>
</div>
{:else if state === 'gamming'}
<Game />
{:else}
<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10">
	{#each gameCards as gameCard}
		<button class="{cCard} {gameCard.gameType === gameType ? 'border-[4px] border-primary-600-300-token' : ''}" on:click="{() => changeGameType(gameCard.gameType)}">
			<header class="card-header">(header)</header>
			<section class="p-4">(content)</section>
			<footer class="card-footer">{gameCard.gameName}</footer>
		</button>
	{/each}
</div>
<button on:click="{waitingGame}" type="button" class="btn variant-filled">게임 시작</button>
{/if}
</div>