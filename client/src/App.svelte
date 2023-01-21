<script>
	import axios from "axios";
	import { onMount } from "svelte";
	
	let input = 0;
	let typeOfTransaction = "+";
	let transactions = [];

	onMount(async () => {
    const { data } = await axios.get("http://localhost:3000/api/transactions");
    transactions = data;
  });

</script>

<style>
  .app {
    margin: 40px auto;
    max-width: 500px;
  }
</style>

<div class="app container">
	<div class="field has-addons">
	  <p class="control">
		<span class="select">
		  <select bind:value={typeOfTransaction}>
			<option value="+">+</option>
			<option value="-">-</option>
		  </select>
		</span>
	  </p>
	  <p class="control is-expanded">
		<input class="input" type="number" bind:value={input} placeholder="Amount of money" />
	  </p>
	  <p class="control">
		<button class="button">Save</button>
	  </p>
	</div>
	<p>{input}</p>
	<p>{typeOfTransaction}</p>
	<p>{JSON.stringify(transactions)}</p>
</div>