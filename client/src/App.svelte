<script>
	import axios from "axios";
	import Transaction from "./components/Transaction.svelte";
	import SummaryCard from "./components/SummaryCard.svelte";
	import Progress from "./components/Progress.svelte";
	import { onMount } from "svelte";
	
	let input = 0;
	let typeOfTransaction = "+";
	let transactions = [];
	let loading = false;

	$: sortedTransaction = transactions.sort((a,b) => b.date - a.date);
	$: disabled = !input;
	$: balance = transactions.reduce((acc, t) => acc + t.value, 0);
	$: income = transactions.filter(t => t.value > 0).reduce((acc, t) => acc + t.value, 0);
	$: expenses = transactions.filter(t => t.value < 0).reduce((acc, t) => acc + t.value, 0);

	onMount(async () => {
	loading = true;
    const { data } = await axios.get("http://localhost:3000/api/transactions");
    transactions = data;
	loading = false;
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
	{#if loading}
		<Progress></Progress>
	{/if}
	{#if transactions.length > 0}
	<SummaryCard value={balance}></SummaryCard>

	<div class="columns">
		<div class="column">
			<SummaryCard value={income} mode={"income"}></SummaryCard>
		</div>
		<div class="column">
			<SummaryCard value={expenses} mode={"expenses"}></SummaryCard>
		</div>
	</div>
	<hr>
	{:else}
	<div class="notification">Add your first transaction</div>
	{/if}
	{#each sortedTransaction as transaction}
	<Transaction transaction={transaction} removeTransaction={removeTransaction}></Transaction>
	{/each}
</div>