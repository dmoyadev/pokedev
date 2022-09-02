<script setup lang="ts">
import { Ref, ref } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useData } from "@/composables/data";
import { usePokemon } from "@/composables/pokemon";
import PokemonCard from "@/components/PokemonCard.vue";
import { NamedAPIResourceList } from "@/models/Common";

const limit = ref(50);
const offset = ref(-limit.value);
const isLoading = ref(false);
const lastPage = ref(false);
const pokemonList = ref<Pokemon[]>([]);

function getPokemonBatch(direction: 'next' | 'prev' = 'next') {
	offset.value += direction === 'next' ? limit.value : -limit.value;
	
	pokemonList.value = [];
	isLoading.value = true;
	
	useData(`pokemon/?offset=${offset.value}&limit=${limit.value}`)
		.then((response: { isLoading: Ref<boolean>, error: Ref, data: Ref<NamedAPIResourceList> }) => {
			lastPage.value = !response.data.value.next;
			
			response.data.value.results.forEach(async ({ name }) => {
				pokemonList.value.push({} as Pokemon);
				const index = pokemonList.value.length - 1;
				usePokemon(name)
					.then(({ pokemon }: { pokemon: Ref<Pokemon | undefined> }) => {
						pokemonList.value[index] = (pokemon.value as Pokemon);
						pokemonList.value.sort((a, b) => (a.order < 0) ? 1 : (a.order - b.order));
					});
			});
		})
		.finally(() => isLoading.value = false);
}
getPokemonBatch("next");
</script>

<template>
	<h1>Pokédev</h1>
	<div class="pokemon-list">
		<PokemonCard
			v-for="(pokemon, index) in pokemonList"
			:key="index"
			:pokemon="pokemon"
		/>
	</div>
	
	<footer>
		<button
			v-if="(offset - limit) > 0"
			@click="getPokemonBatch('prev')"
		>
			Prev page!
		</button>
		<button
			v-if="!lastPage"
			@click="getPokemonBatch('next')"
		>
			Next page!
		</button>
	</footer>
</template>

<style scoped lang="scss">
.pokemon-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	grid-gap: 20px;
	margin: 20px 0;
}

footer {
	width: 100%;
	display: flex;
	justify-content: space-between;
	
	button:only-child {
		margin-left: auto;
	}
}
</style>
