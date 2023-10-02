<script lang='ts'>
	import { ProgressRadial, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Game from '$lib/Game/Game.svelte';
	import { socket } from '$lib/common';
	import { gameStateStore } from '$lib/store';

	let mapType:string | undefined;
	let pageElement: HTMLElement | null;

	const gameCards: {img: string, gameName:string, mapType:string, src: string,content:string}[] = [
		{img: 'http/gif', gameName:'일반 게임', mapType:'NORMAL', src:'https://cdn.dribbble.com/users/26516/screenshots/1871645/media/95496d595056b08694f5ea98ec55af82.gif', content: '두 플레이어가 각자의 패들을 조작하여 상대방의 패들 넘어로 공을 넘기면 점수를 얻게 됩니다. 누구나 쉽게 할 수 있는 ping-pong 게임 모드 입니다.'},
		{img: 'http/gif', gameName:'스피드 게임', mapType:'FAST', src:'https://cdna.artstation.com/p/assets/images/images/006/059/004/original/leiden-quelch-pingpong.gif?1495727505', content: '서로의 패들로 공을 튕겨 낼 때 마다 공의 속도가 빨라지는 모드입니다. 처음에는 느리게 시작하겠지만, 패들로 공을 계속해서 튕기다 보면 공의 속도가 놀랍게 증가합니다.'},
	];


	onMount(() => {
		pageElement = document.querySelector('#page');
		pageElement?.classList.add('h-screen');
		socket.emit('get UserState', (userState:string) => {
			$gameStateStore = userState;
		});
		return () => {
			pageElement?.classList.remove('h-screen');
		};
	});

	socket.on('get UserState', (userState:string) => {
		$gameStateStore = userState;
	}); 

	function waitingGame() {
		if (mapType === undefined){
			const t: ToastSettings = {
				message: '게임을 선택해 주세요.',
				hideDismiss: true,
				timeout: 2000
			};
			toastStore.trigger(t);
			return ;
		}
		socket.emit('join GameQueue', {mapType: mapType}, (payload: any) => {
			console.log(payload)
			const t: ToastSettings = {
				message: payload.errorMessage,
				hideDismiss: true,
				timeout: 2000
			};
			toastStore.trigger(t);
		});
	};

	function changeGameType(type:string){
		mapType = type;
		//state 확인
	}
	
	const cCard = 'grid grid-rows-[1fr_1fr_auto] snap-start shrink-0 card card-hover py-20 w-40 md:w-80 h-full text-center';
</script>

<div class="gamePage flex flex-col h-[90vh] justify-center items-center {$gameStateStore === 'gamming' ? 'bg-zinc-700': ''}">
{#if $gameStateStore === 'waiting'}
<div class="flex flex-col items-center p-4 space-y-2" transition:fade>
<ProgressRadial stroke={50} meter="stroke-primary-500" track="stroke-primary-500/30" width="w-20"/>
<p class="text-primary-500">상대를 찾는 중</p>
</div>
{:else if $gameStateStore === 'gamming'}
<Game />
{:else}
<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10">
	{#each gameCards as gameCard}
		<button on:click="{() => changeGameType(gameCard.mapType)}">
			<div class="{cCard} {gameCard.mapType === mapType ? 'border-[4px] border-primary-600-300-token' : ''}">
				<!-- <header class="card-header bg-black/50 w-full aspect-[21/9]"><img src={gameCard.src} alt="ping_pong"></header> -->
				<header class="card-header font-bold text-xl">{gameCard.gameName}</header>
				<section class="p-4">{gameCard.content}</section>
				<!-- <hr class="opacity-50" /> -->
				<!-- <footer class="card-footer ">{gameCard.gameName}</footer> -->
			</div>
		</button>
	{/each}
</div>
<button on:click="{waitingGame}" type="button" class="btn variant-filled">게임 시작</button>
{/if}
</div>