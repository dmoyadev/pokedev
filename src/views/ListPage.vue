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

const route = useRoute();
const queryPage = Number(route?.query?.page) || 1;
const page = ref(queryPage);

const limit = ref(50);
const offset = ref(page.value * limit.value);
const totalPages = ref(1);

const pokemonList = ref<Pokemon[]>([]);
const pokemonNamesList = ref<string[]>([]);
const currentPokemonNamesList = computed(() => pokemonNamesList.value.slice(offset.value, offset.value + limit.value));

const router = useRouter();

function getPokemonBatch(navigateTo?: 'next' | 'prev' | number) {
	if(typeof navigateTo === 'number') {
		// Coming from clicking a navigation page
		// Avoid trying to fetch pages that doesn't exist
		if(navigateTo <= 1) {
			navigateTo = 1;
			router.push({});
		}
		
		if(navigateTo >= totalPages.value) {
			navigateTo = totalPages.value;
			router.push({ query: { page: totalPages.value }});
		}
		page.value = navigateTo;
		
		offset.value = (navigateTo - 1) * limit.value;
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
						if (pokemonIsInPage) {
							pokemonList.value[index] = (pokemon.value as Pokemon);
							pokemonList.value.sort((a, b) => (a.order < 0) ? 1 : (a.order - b.order));
						}
					}
				});
		});
}

const debouncedFetchPokemonList = debounce(getPokemonBatch, 500);

async function getPokemonNames() {
	const { data }: { data: Ref<NamedAPIResourceList> } = await useFetchData(`pokemon?limit=-1`);
	pokemonNamesList.value = data.value.results.map(({ name }) => name);
	totalPages.value = Math.ceil(data.value.count / limit.value) - 1;
	debouncedFetchPokemonList();
}
getPokemonNames();
</script>

<template>
	<main>
		<h1>Pokédev</h1>
		<Navigation
			class="navigation"
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
	 width: 100%;
 }
 
.pokemon-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	grid-gap: 20px;
	margin: 20px 0;
}

.navigation {
	align-self: center;
}
</style>
