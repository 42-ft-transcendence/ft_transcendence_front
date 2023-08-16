export const channelIcon = ["fa fa-users", "fa fa-user-plus", "fa fa-lock fa-lg"] // public, private, protected

export  function getCookie(name: string) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}