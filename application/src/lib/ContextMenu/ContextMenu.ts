export class ContextMenu {
	public pos;
	private menu = { w: 0, h: 0 };
	private browser = { w: 0, h: 0 };
	constructor() {
		this.pos = { x: 0, y: 0 };
	}

	rightClickContextMenu(e: MouseEvent) {
		this.browser = {
			w: window.innerWidth,
			h: window.innerHeight,
		};
		this.pos = {
			x: e.clientX,
			y: e.clientY,
		};
		if (this.browser.h - this.pos.y < this.menu.h)
			this.pos.y = this.pos.y - this.menu.h;
		if (this.browser.w - this.pos.x < this.menu.w)
			this.pos.x = this.pos.x - this.menu.w;
	}

	getContextMenuDimension(node: HTMLElement) {
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		this.menu = {
			h: height,
			w: width,
		};
	}
}
