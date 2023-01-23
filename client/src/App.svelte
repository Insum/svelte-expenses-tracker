<script>
	import axios from "axios";
	import { onMount } from "svelte";
	
	let input = 0;
	let typeOfTransaction = "+";
	let transactions = [];

	$: disabled = !input;
	$: balance = transactions.reduce((acc, t) => acc + t.value, 0);
	$: income = transactions.filter(t => t.value > 0).reduce((acc, t) => acc + t.value, 0);
	$: expenses = transactions.filter(t => t.value < 0).reduce((acc, t) => acc + t.value, 0);

	onMount(async () => {
    const { data } = await axios.get("http://localhost:3000/api/transactions");
    transactions = data;
  });

  async function addTransaction() {
    const transaction = {
      date: new Date().getTime(),
      value: typeOfTransaction === "+" ? input : input * -1
    };
    const response = await axios.post("http://localhost:3000/api/transactions", transaction);
    transactions = [response.data, ...transactions];
    input = 0;
  }

  async function removeTransaction(id) {
    const response = await axios.delete("http://localhost:3000/api/transactions/" + id);
    if (response.data.id === id) {
      transactions = transactions.filter(t => t._id !== id);
    }
  }

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
		<button class="button" on:click={addTransaction} {disabled}>Save</button>
	  </p>
	</div>
	<div class="notification is-info is-light has-text-centered">
		Balance: <strong>{balance}</strong>
	</div>

	<div class="columns">
		<div class="column">
			<div class="notification is-success is-light has-text-centered">
				Income: <strong>{income}</strong>
			</div>
		</div>
		<div class="column">
			<div class="notification is-danger is-light has-text-centered">
				Expenses: <strong>{expenses}</strong>
			</div>
		</div>
	</div>

	<hr>
	{#each transactions as transaction}
		<div class="notification is-light {transaction.value > 0 ? 'is-success' : 'is-danger'}">
			{transaction.value}
			<button class="delete" on:click={() => removeTransaction(transaction._id)}></button>
		</div>
	{/each}
</div>