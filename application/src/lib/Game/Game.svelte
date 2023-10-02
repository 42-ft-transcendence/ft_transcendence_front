<script lang="ts">
	import { socket } from '$lib/common';
	import {
		gameStateStore,
	} from '$lib/store';
	import { onMount } from 'svelte';
	type Player = {
		x: number;
		y: number;
		width: number;
		height: number;
		score: number;
		color: string;
	};
	type Ball = { x: number; y: number; radius: number; color: string };
	type GameInfo = {
		ball: { x: number; y: number };
		player1: { y: number; score: number };
		player2: { y: number; score: number };
	};
	let pageElement: Element;
	let canvasElement: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let canvas: CanvasRenderingContext2D;
	let isGameStarted: boolean = false;
	const initWidth = 20;
	const initHeight = 150;
	const initBackSideMargin = 100;
	const resolveWidth = 1920;
	const resolveHeight = 1080;
	const radiusBall = 15;
	const player1: Player = {
		x: initBackSideMargin - initWidth / 2,
		y: resolveHeight / 2 - initHeight / 2,
		width: initWidth,
		height: initHeight,
		score: 0,
		color: 'white',
	};
	const player2: Player = {
		x: resolveWidth - initBackSideMargin - initWidth / 2,
		y: resolveHeight / 2 - initHeight / 2,
		width: initWidth,
		height: initHeight,
		score: 0,
		color: 'white',
	};
	const ball: Ball = {
		x: resolveWidth / 2,
		y: resolveHeight / 2,
		radius: radiusBall,
		color: 'white',
	};

	onMount(() => {
		const element = document.querySelector('.gamePage');
		if (element === null) return;
		pageElement = element;
		const resizeObserver = new ResizeObserver(responsiveRatio);
		resizeObserver.observe(pageElement);
		ctx = canvasElement.getContext('2d');
		if (ctx !== null) canvas = ctx;
		draw();
		drawText('We are going to start the game...');
		return () => resizeObserver.unobserve(pageElement);
	});

	socket.on('update Game', (payload: GameInfo) => {
		isGameStarted = true;
		updateGame(payload);
		draw();
	});

	socket.on('pause Game', (gameInfo: GameInfo, payload: { count: number }) => {
		isGameStarted = false;
		updateGame(gameInfo);
		canvas.fillStyle = '#003f9e';
		canvas.fillRect(0, 0, resolveWidth, resolveHeight);
		drawMap();
		drawBall();
		drawPlayerwithSore(player1);
		drawPlayerwithSore(player2);
		drawText(`Pause Game ${Math.floor(payload.count / 60)}`);
	});

	socket.on('end Game', (payload: { winner: string }) => {
		draw();
		drawText(`${payload.winner} WIN!`);
		setTimeout(() => {
			$gameStateStore = '';
		}, 2000);
	});

	function updateGame(gameInfo: GameInfo) {
		ball.x = gameInfo.ball.x;
		ball.y = gameInfo.ball.y;
		player1.y = gameInfo.player1.y;
		player1.score = gameInfo.player1.score;
		player2.y = gameInfo.player2.y;
		player2.score = gameInfo.player2.score;
	};

	function responsiveRatio() {
		let width = pageElement.clientWidth;
		let height = width * 0.5625;

		if (height > pageElement.clientHeight) {
			height = pageElement.clientHeight;
			width = height * 1.7777;
		}
		canvasElement.style.width = `${width}px`;
		canvasElement.style.height = `${height}px`;
	};

	function draw() {
		canvas.fillStyle = '#0066ff';
		canvas.fillRect(0, 0, resolveWidth, resolveHeight);
		drawMap();
		drawBall();
		drawPlayerwithSore(player1);
		drawPlayerwithSore(player2);
	};

	function drawBall() {
		canvas.fillStyle = ball.color;
		canvas.beginPath();
		canvas.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
		canvas.fill();
	};
	
	function drawPlayerwithSore(player: Player) {
		canvas.fillStyle = player.color;
		canvas.fillRect(
			player.x - initWidth / 2,
			player.y - initHeight / 2,
			player.width,
			player.height,
		);

		canvas.font = '60px Arial';
		canvas.fillText(
			player.score.toString(),
			player.x < resolveWidth / 2
				? resolveWidth / 2 - 100 - player.score.toString().length * 40
				: resolveWidth / 2 + 100,
			100,
		);
	};

	function drawMap() {
		canvas.strokeStyle = 'white';
		canvas.lineWidth = 5;
		canvas.beginPath();
		canvas.setLineDash([20, 30]);
		canvas.moveTo(resolveWidth / 2, 0);
		canvas.lineTo(resolveWidth / 2, resolveHeight);
		canvas.stroke();
	};

	function drawText(str: string) {
		canvas.font = '100px Arial';
		canvas.textAlign = 'center';
		canvas.fillStyle = 'white';
		canvas.fillText(str, resolveWidth / 2, resolveHeight / 2);
	};

	// 키보드 조작인 경우.
	function movePlayer(e: KeyboardEvent) {
		if (isGameStarted) {
			if (e.key === 'ArrowUp') {
				console.log('up');
				socket.volatile.emit('move Player', { direction: 'up' });
			} else if (e.key === 'ArrowDown') {
				console.log('down');
				socket.volatile.emit('move Player', { direction: 'down' });
			}
		}
	}
</script>

<svelte:window on:keydown="{movePlayer}" />
<canvas
	bind:this="{canvasElement}"
	width="{resolveWidth}"
	height="{resolveHeight}"></canvas>
