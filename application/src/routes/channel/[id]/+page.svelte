<script lang='ts'>
	import ShowChannelInfoModal from '$lib/Modal/ShowChannelInfoModal.svelte';
	import { Avatar, modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	export let data;
	console.log(data); //TODO: remove
	
	const channelData = data.channelData;

	export let username:string = "Jane"; //TODO: 현재 로그인해있는 사용자의 이름을 받아와서 저장해서 이 페이지에서 반영구적으로 사용하는 방법 찾아보기
	
	let currentMessage:string = '';
	
	const showChannelInfoModalComponent: ModalComponent = {
		ref: ShowChannelInfoModal
	};
	// ƒør making comment timezone
	const date = new Date();
	const todayYear = date.getFullYear();
	const todayMonth = date.getMonth();
	const todayDay = date.getDate();
	let dateFlag: number[] = [-1, -1, -1];
	// parent div page element
	let elemPage: HTMLElement | null;

	let elemChat: HTMLElement | null;
	
	onMount(() => {
		elemPage = document.querySelector('#page');
		elemChat = document.querySelector('.chat');
	});

	function addMessage(): void{
		// TODO modify newMessage
		if (currentMessage === '')
			return;
		const newMessage = {
			avatar: 'Jane_avatar',
			name: 'Jane',
			timestamp: new Date(),
			message: currentMessage
		};
		// Append the new message to the message feed
		channelData.message = [...channelData.message, newMessage];
		// Clear the textarea message and dataFlag
		currentMessage = '';
		dateFlag = [-1, -1, -1];
		// Smoothly scroll to the bottom of the feed
		setTimeout(() => { scrollChatBottom('smooth'); }, 0);
	}
	
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		if (elemPage)
			elemPage.scrollTo({ top: elemPage.scrollHeight, behavior });
	}
	
	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	function convertTimeToDateFormat(dateObj: Date): string {
		let hour = dateObj.getHours()
		let minute = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes()
		let meridiem = "오전 ";
		if (hour >= 12){
			meridiem = "오후 ";
			hour -= 12;
		}
		return meridiem + hour + ":" + minute
	}
	
	function canInsertChatFlag(dateObj: Date): boolean {
		if (dateFlag[0] === dateObj.getFullYear() && dateFlag[1] === dateObj.getMonth() && dateFlag[2] === dateObj.getDate())
			return false;
		dateFlag[0] = dateObj.getFullYear();
		dateFlag[1] = dateObj.getMonth();
		dateFlag[2] = dateObj.getDate();
		return true;
	}

	function isToday(dateObj: Date): boolean {
		if (todayYear === dateObj.getFullYear() && todayMonth === dateObj.getMonth() && todayDay === dateObj.getDate())
			return true;
		return false;
	}

	function showChannelInfo(){
		const modal: ModalSettings = {
			title: channelData.name,
			type: 'component',
			component: showChannelInfoModalComponent,
			response: (r) => {
				if (r !== false)
					elemChat?.dispatchEvent(r)
			}
		};
		modalStore.trigger(modal);
	}
</script>

<div class="chat" bind:this={elemChat}>
	<section class="border-y border-surface-500/30 p-2.5 sticky top-0 bg-surface-100-800-token z-50">
		<div class="grid grid-cols-[1fr_auto]">
			<div class="flex items-center">
				<div class="font-bold text-lg">{channelData.name}</div>
			</div>
			<button class="p-2 rounded-md hover:bg-surface-200-700-token" on:click={showChannelInfo}>
			<div><i class="fa fa-user" aria-hidden="true" />{channelData._count.participant}</div>
			</button>
		</div>
	</section>
	<section class="p-4 overflow-y-auto space-y-4">
		{#each channelData.message as bubble}
			{#if canInsertChatFlag(bubble.timestamp)}
				{#if isToday(bubble.timestamp)}
				<div class="flex justify-center items-center">
					<span class="badge variant-filled">오늘</span>
				</div>
				{:else}
				<div class="flex justify-center items-center">
					<span class="badge variant-filled">
						{bubble.timestamp.getFullYear() + "년 " + bubble.timestamp.getMonth() + "월 " + bubble.timestamp.getDate() + "일"}
					</span>
				</div>
				{/if}
			{/if}
			{#if username === bubble.name}
				<div class="grid grid-cols-[1fr_auto] gap-2">
					<div class="card p-4 variant-soft-primary rounded-tr-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">{bubble.name}</p>
							<small class="opacity-50">{convertTimeToDateFormat(bubble.timestamp)}</small>
						</header>
						<p>{bubble.message}</p>
					</div>
					<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
				</div>
			{:else}
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
					<div class="card p-4 variant-soft rounded-tl-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">{bubble.name}</p>
							<small class="opacity-50">{convertTimeToDateFormat(bubble.timestamp)}</small>
						</header>
						<p>{bubble.message}</p>
					</div>
				</div>
			{/if}
			{/each}
	</section>
	<section class="border-t border-surface-500/30 p-4 sticky bottom-0 backdrop-blur-md">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
			<button class="input-group-shim">+</button>
			<textarea
				bind:value={currentMessage}
				class="bg-transparent border-0 ring-0"
				name="prompt"
				id="prompt"
				placeholder=" Write a message..."
				rows="1"
				on:keypress={onPromptKeydown}
			/>
			<button class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'} on:click={addMessage}>
				<i class="fa fa-paper-plane" aria-hidden="true"></i>
			</button>
		</div>
	</section>
</div>