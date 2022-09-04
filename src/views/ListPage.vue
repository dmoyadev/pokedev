<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useFetchData } from "@/composables/fetchData";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import PokemonCard from "@/components/PokemonCard.vue";
import { NamedAPIResourceList } from "@/models/Common";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "@/utils/debounce";
import Navigation from "@/components/PageNavigation.vue";

// Pagination
const route = useRoute();
const queryPage = Number(route?.query?.page) || 1;
const page = ref(queryPage);

const limit = ref(50);
const offset = ref(page.value * limit.value);
const totalPages = computed(() => {
	if(searchQuery.value) {
		return Math.ceil(pokemonNamesSearched.value.length / limit.value);
	}

	return Math.ceil(pokemonNamesList.value.length / limit.value);
});

// List generation
const pokemonList = ref<Pokemon[]>([]);
const pokemonNamesList = ref<string[]>([]);
const currentPokemonNamesList = computed(() => {
	if(searchQuery.value) {
		return pokemonNamesSearched.value.slice(offset.value, offset.value + limit.value);
	}
	
	return pokemonNamesList.value.slice(offset.value, offset.value + limit.value);
});

// Batch loading of Pokémon
const router = useRouter();
const debouncedFetchPokemonList = debounce(getPokemonBatch, 500);
function getPokemonBatch(navigateTo?: 'next' | 'prev' | number) {
	if(typeof navigateTo === 'number') {
		// Coming from clicking a navigation page
		// Avoid trying to fetch pages that doesn't exist
		if(navigateTo <= 1) {
			navigateTo = 1;
			router.push({});
		} else if(navigateTo >= totalPages.value) {
			navigateTo = totalPages.value;
			router.push({ query: { page: totalPages.value }});
		}
		
		offset.value = (navigateTo - 1) * limit.value;
		page.value = navigateTo;
	} else {
		//Coming from URL or next/prev buttons
		offset.value += navigateTo === 'next' ? limit.value : -limit.value;
		page.value = Math.ceil(offset.value / limit.value) + 1;
		
		if(page.value <= 1) {
			page.value = 1;
			router.push({});
		}
	}
	
	// Reload the Pokémon list
	pokemonList.value = [];
	
	currentPokemonNamesList.value
		.forEach(pokemonName => {
			pokemonList.value.push({} as Pokemon);
			const index = pokemonList.value.length - 1;
			useFetchPokemon(pokemonName)
				.then(({ pokemon }: { pokemon: Ref<Pokemon | undefined> }) => {
					if(pokemon.value) {
						const pokemonIsInPage = pokemon.value?.id > offset.value && pokemon.value?.id <= offset.value + limit.value;
						if (pokemonIsInPage || (!pokemonIsInPage && searchQuery.value)) {
							pokemonList.value[index] = (pokemon.value as Pokemon);
							pokemonList.value.sort((a, b) => (a.id < 0) ? 1 : (a.id - b.id));
						}
					}
				});
		});
}

// Search
const searchQuery = ref((route.query?.search as string) ||'');
const pokemonNamesSearched = computed(() => pokemonNamesList.value.filter(name => name.toLowerCase().includes(searchQuery.value.toLowerCase())));

// Init
const ID_STARTING_FORMS = 10_000;
async function getPokemonNames() {
	const { data }: { data: Ref<NamedAPIResourceList> } = await useFetchData(`pokemon?limit=-1`);
	pokemonNamesList.value = data.value.results
		.filter(({ url }) => {
			// Regexp that gets the last param in an url
			const id = Number(url.match(/\/(\d+)\/$/)?.[1]);
			return id < ID_STARTING_FORMS;
		})
		.map(({ name }) => name);
	debouncedFetchPokemonList();
}
getPokemonNames();
</script>

<template>
	<main>
		<h1>Pokédev</h1>
		<aside class="controls">
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Search Pokémon"
				@input="debouncedFetchPokemonList(1)"
			>
			<Navigation
				class="navigation"
				:page="page"
				:total-pages="totalPages"
				@change-page="debouncedFetchPokemonList($event)"
			/>
		</aside>
		<div class="pokemon-list">
			<PokemonCard
				v-for="(pokemon, index) in pokemonList"
				:key="index"
				:pokemon="pokemon"
			/>
		</div>
		<Navigation
			class="navigation"
			:page="page"
			:total-pages="totalPages"
			@change-page="debouncedFetchPokemonList($event)"
		/>
	</main>
</template>

<style scoped lang="scss">
 main {
	 display: flex;
	 flex-direction: column;
	 gap: 20px;
	 width: 100%;
 }
 
 .controls {
	 display: flex;
	 flex-wrap: wrap;
	 align-items: center;
	 justify-content: center;
	 gap: 20px;
 }
 
 input {
	 flex: 1;
	 color: var(--color-primary-text);
	 border: 1px solid var(--color-primary);
	 border-radius: 5px;
	 background: var(--color-background);
	 height: 40px;
	 padding: 5px 10px;
 }
 
.pokemon-list {
	display: grid;
	grid-gap: 20px;
	--grid-max-number-of-columns: 7;
	--gap-count: calc(var(--grid-max-number-of-columns) - 1);
	--grid-item--max-width: calc((100% - 20px) / var(--gap-count));
	grid-template-columns: repeat(auto-fill, minmax(max(200px, var(--grid-item--max-width)), 1fr));
	margin-top: 10px;
}

.navigation {
	flex-shrink: 0;
	align-self: center;
}
</style>
