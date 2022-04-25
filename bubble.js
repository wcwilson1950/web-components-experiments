class MyBubble extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({mode: 'open'});
		this.radius = this.radius || '100';
		this.color = this.color || 'red';
	}
	get color() {
		return this.getAttribute('color');
	}
	set color(val) {
		this.setAttribute('color',val);
	}
	get radius() {
		return this.getAttribute('radius');
	}
	set radius(val) {
		this.setAttribute('radius',val);
	}
	static get observedAttributes() {
		return ['color','radius'];
	}
	attributeChangedCallback(name,oldVal,newVal) {
		this.render();
//		const radiusInput = this.shadow.querySelector('#radius');
//		const colorInput = this.shadow.querySelector('#color');
//		radiusInput.addEventListener('change',this.changeRadius.bind(this));
//		colorInput.addEventListener('change',this.changeColor.bind(this));
	}
	changeRadius(e) {
		this.setAttribute('radius', e.target.value);
	}
	changeColor(e) {
		this.setAttribute('color',e.target.value);
	}
	connectedCallback() {
		this.render();
//		const radiusInput = this.shadow.querySelector('#radius');
//		const colorInput = this.shadow.querySelector('#color');
//		radiusInput.addEventListener('change',this.changeRadius.bind(this));
//		colorInput.addEventListener('change',this.changeColor.bind(this));
	}
	render() {
		this.shadow.innerHTML = `
<style>

.ball {
	display: inline-block;
	width: 100%;
	height: 100%;
	border-radius: 100%;
	position: relative;
	background: radial-gradient(circle at bottom, #81e8f6, #76deef 10%, #055194 80%, #062745 100%); }
	.ball:before {
		content: "";
		position: absolute;
		top: 1%;
		left: 5%;
		width: 90%;
		height: 90%;
		border-radius: 100%;
		background: radial-gradient(circle at top, white, rgba(255, 255, 255, 0) 58%);
		-webkit-filter: blur(5px);
		filter: blur(5px);
		z-index: 2; }
	.ball:after {
		content: "";
		position: absolute;
		display: none;
		top: 5%;
		left: 10%;
		width: 80%;
		height: 80%;
		border-radius: 100%;
		-webkit-filter: blur(1px);
		filter: blur(1px);
		z-index: 2;
		-webkit-transform: rotateZ(-30deg);
		transform: rotateZ(-30deg); }
	.ball .shadow {
		position: absolute;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 50%);
		-webkit-transform: rotateX(90deg) translateZ(-160px);
		transform: rotateX(90deg) translateZ(-160px);
		z-index: 1; }
	.ball.plain {
		background: black; }
		.ball.plain:before, .ball.plain:after {
			display: none; }
	.ball.bubble {
		background: radial-gradient(circle at 50% 55%, rgba(240, 245, 255, 0.9), rgba(240, 245, 255, 0.9) 40%, rgba(225, 238, 255, 0.8) 60%, rgba(43, 130, 255, 0.4));
		-webkit-animation: bubble-anim 2s ease-out infinite;
		animation: bubble-anim 2s ease-out infinite; }
		.ball.bubble:before {
			-webkit-filter: blur(0);
			filter: blur(0);
			height: 80%;
			width: 40%;
			background: radial-gradient(circle at 130% 130%, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 46%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.8) 58%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 100%);
			-webkit-transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg);
			transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg); }
		.ball.bubble:after {
			display: block;
			background: radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 74%, white 80%, white 84%, rgba(255, 255, 255, 0) 100%); }

.stage {
	width: ${this.radius}px;
	height: ${this.radius}px;
	display: inline-block;
	margin: 20px;
	-webkit-perspective: 1200px;
	-moz-perspective: 1200px;
	-ms-perspective: 1200px;
	-o-perspective: 1200px;
	perspective: 1200px;
	-webkit-perspective-origin: 50% 50%;
	-moz-perspective-origin: 50% 50%;
	-ms-perspective-origin: 50% 50%;
	-o-perspective-origin: 50% 50%;
	perspective-origin: 50% 50%;
}
@-webkit-keyframes bubble-anim {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1); }

	20% {
		-webkit-transform: scaleY(0.95) scaleX(1.05);
		transform: scaleY(0.95) scaleX(1.05); }

	48% {
		-webkit-transform: scaleY(1.1) scaleX(0.9);
		transform: scaleY(1.1) scaleX(0.9); }

	68% {
		-webkit-transform: scaleY(0.98) scaleX(1.02);
		transform: scaleY(0.98) scaleX(1.02); }

	80% {
		-webkit-transform: scaleY(1.02) scaleX(0.98);
		transform: scaleY(1.02) scaleX(0.98); }

	97%, 100% {
		-webkit-transform: scale(1);
		transform: scale(1); } }

@keyframes bubble-anim {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1); }

	20% {
		-webkit-transform: scaleY(0.95) scaleX(1.05);
		transform: scaleY(0.95) scaleX(1.05); }

	48% {
		-webkit-transform: scaleY(1.1) scaleX(0.9);
		transform: scaleY(1.1) scaleX(0.9); }

	68% {
		-webkit-transform: scaleY(0.98) scaleX(1.02);
		transform: scaleY(0.98) scaleX(1.02); }

	80% {
		-webkit-transform: scaleY(1.02) scaleX(0.98);
		transform: scaleY(1.02) scaleX(0.98); }

	97%, 100% {
		-webkit-transform: scale(1);
		transform: scale(1); } }
</style>
<section class="stage">
	<figure class="ball bubble"></figure>
</section>
`;
	}
}
customElements.define('my-bubble',MyBubble);
