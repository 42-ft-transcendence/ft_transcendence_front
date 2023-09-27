<script>
	import { goto } from "$app/navigation";

	async function handleLogin() {
		window.location.replace('http://localhost:3000/oauth/42');
	}
</script>
<div class="w-full h-full flex items-center justify-center"> 
	<div class="card card-hover bg-initial w-80 h-80">
		<header class="card-header">Login</header>
		<section class="p-4 space-y-2 flex flex-col h-[280px] justify-center">
			<button class="btn variant-filled" on:click="{handleLogin}">42 로그인</button>
		</section>
	</div>
</div>