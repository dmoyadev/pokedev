<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useFetchData } from "@/composables/fetchData";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import PokemonCard from "@/components/PokemonCard.vue";
import { APIResourceWithId, NamedAPIResourceList } from "@/models/Common";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "@/utils/debounce";
import Navigation from "@/components/PageNavigation.vue";
import PokemonSearch from "@/components/PokemonSearch.vue";
import { Generation } from "@/models/Game";
import { capitalize } from "@/utils/strings";
import { useFetchGenerations } from "@/composables/fetchGenerations";

// Pagination
const route = useRoute();
const queryPage = Number(route?.query?.page) || 1;
const page = ref(queryPage);

const limit = ref(50);
const offset = ref(page.value * limit.value);
const totalPages = computed(() => Math.ceil(pokemonNamesFiltered.value.length / limit.value));

// List generation
const pokemonList = ref<Pokemon[]>([]);
const pokemonNamesList = ref<APIResourceWithId[]>([]);
const currentPokemonNamesList = computed(() => pokemonNamesFiltered.value.slice(offset.value, offset.value + limit.value));

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
		.forEach(({ name }) => {
			pokemonList.value.push({} as Pokemon);
			const index = pokemonList.value.length - 1;
			useFetchPokemon(name)
				.then(({ pokemon }: { pokemon: Ref<Pokemon | undefined> }) => {
					if(pokemon.value) {
						const pokemonIsInPage = pokemon.value?.id > offset.value && pokemon.value?.id <= offset.value + limit.value;
						if (pokemonIsInPage || (!pokemonIsInPage && isFiltering.value)) {
							pokemonList.value[index] = (pokemon.value as Pokemon);
							pokemonList.value.sort((a, b) => (a.id < 0) ? 1 : (a.id - b.id));
						}
					}
				});
		});
}

// Filtering
const isFiltering = computed(() => searchQuery.value || generationQuery.value);
const searchQuery = ref('');

const generationQuery = ref<Generation>();
const { generations } = useFetchGenerations();

const pokemonNamesFiltered = computed(() => pokemonNamesList.value.filter(({ name, id }) => {
	const search = searchQuery.value
		? name.toLowerCase().includes(searchQuery.value?.toLowerCase()) || id === Number(searchQuery.value)
		: true;
	const generation = generationQuery.value
		? generationQuery.value?.pokemon_species?.map(({ name }) => name)?.includes(name)
		: true;
	
	return search && generation;
}));

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
		.map(({ name, url }) => {
			// Regexp that gets the last param in an url
			const id = Number(url.match(/\/(\d+)\/$/)?.[1]);
			return { name, id };
		});
	debouncedFetchPokemonList();
}
getPokemonNames();

</script>

<template>
	<main>
		<h1>Pokédev</h1>
		<aside class="filters">
			<select
				v-model="generationQuery"
				@change="debouncedFetchPokemonList(1)"
			>
				<option
					selected
					:value="undefined"
				>
					Todas las generaciones
				</option>
				<option
					v-for="(generation, index) in generations"
					:key="index"
					:value="generation"
				>
					{{ capitalize(generation.main_region.name) }} ({{ generation.pokemon_species.length }})
				</option>
			</select>
			<PokemonSearch
				v-model:search-query="searchQuery"
				:pokemon-list="pokemonNamesList"
				:pokemon-names-searched="pokemonNamesFiltered"
				class="search"
				@search="debouncedFetchPokemonList(1)"
				@clear-search="debouncedFetchPokemonList(1)"
			/>
		</aside>
		<Navigation
			class="navigation"
			reduced-version
			:page="page"
			:total-pages="totalPages"
			@change-page="debouncedFetchPokemonList($event)"
		/>
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

.filters {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 20px;
	
	select {
		flex: 1;
		height: 40px;
		background: var(--color-background);
		border: 1px solid var(--color-primary);
		border-radius: 5px;
		color: var(--color-primary);
		padding: 10px;
	}
	
	.search {
		flex: 2;
	}
}

.navigation {
	flex-shrink: 0;
	align-self: center;
}

.pokemon-list {
	display: grid;
	grid-gap: 20px;
	--grid-max-number-of-columns: 7;
	--gap-count: calc(var(--grid-max-number-of-columns) - 1);
	--grid-item--max-width: calc((100% - 20px) / var(--gap-count));
	grid-template-columns: repeat(auto-fill, minmax(max(200px, var(--grid-item--max-width)), 1fr));
}
</style>
