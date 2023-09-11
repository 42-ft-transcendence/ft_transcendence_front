<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { BaseUrl, JWT_DB_KEY, getCookie } from '$lib/common';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import axios from 'axios';
	
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	let response: any;
	
	let qrURL: string
	onMount(async () => {
		// response = await fetch(BaseUrl.AUTH + 'otp/generate', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
		// 	},
		// 	body: JSON.stringify({}),
		// });
		response = await axios.post(BaseUrl.AUTH + 'otp/generate', {}, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie(JWT_DB_KEY)}`,
			},
		});
		QRCode.toDataURL(response?.data?.otpauthUrl).then((url: any) => { qrURL = url }).catch((err: any) => { console.error(err)});
	});

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

</script>

{#if $modalStore[0]}
	<div class="{cBase}">
		<header class="{cHeader}">2단계 인증 설정하기</header>
		<div>
			<h4>QR Code</h4>
			<div class="flex justify-center">
				<img
					class="block w-64 h-64 object-contain"
					src="{qrURL}"
					alt="qrcode url"
				/>
			</div>
		</div>
		<hr/>
		<h2>Code verification</h2>
		<hr/>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click="{parent.onClose}"
				>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}

<style>
	input:checked ~ .toggle__line {
		background-color: #48bb78;
	}

	input:checked ~ .toggle__dot {
		transform: translateX(100%);
	}

	.btn-sm {
		font-size: calc(0.5rem + 0.25vw);
		padding: calc(0.15rem + 0.25vw) calc(0.15rem + 0.1vw);
	}
</style>
