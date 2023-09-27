<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { toastStore } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";

	onMount(async () => {
		if ($page.error?.message) {
			await goto('/', { replaceState: true });
			toastStore.trigger({
				message: $page.error.message === 'Not Found' ? '존재하지 않는 페이지입니다.' : $page.error.message,
				background: 'variant-filled-warning',
				hideDismiss: true,
				timeout: 2000,
			});
		}
	});
</script>
