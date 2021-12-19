<script lang="ts">
	export let name: string;
	let counter: number = 0;

	$: doubled = counter * 2;

	const countUp = () => {
		counter += 1;
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<h1>Counter: {counter}</h1>
	<h1>Doubled: {doubled}</h1>
	<button on:click={countUp}>
		Count up
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>