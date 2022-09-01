<script setup lang="ts">
import { ref } from "vue";
import { PokemonSpecies } from "@/models/Pokemon";
import { useData } from "@/composables/data";
import { usePokemon } from "@/composables/pokemon";
import { failedSprites } from "@/utils/failedSprites";

const offset = ref(0);
const limit = ref(50);
const isLoading = ref(false);
const pokemonList = ref<PokemonSpecies[]>([]);

function getPokemonBatch() {
	pokemonList.value = [];
	isLoading.value = true;
	useData(`pokemon-species/?offset=${offset.value}&limit=${limit.value}`)
		.then(response => {
			response.data.value.results.forEach(async ({ name }) => {
				const { pokemon } = await usePokemon(name, false);
				pokemonList.value.push(pokemon.value as PokemonSpecies);
				pokemonList.value.sort((a, b) => (a.order < 0) ? 1 : (a.order - b.order));
			});
		})
		.finally(() => isLoading.value = false);
	
	offset.value += limit.value;
}
getPokemonBatch();

const triedSprites = ref<string[]>([]);
/**
 * There are some Pokémon names that does not match the Pokémon name being
 * used by Pokémon ShowDown's sprites
 * @param {Event} e
 * @param {PokemonSpecies} pokemon
 */
function replaceWithDefaultSprite(e: Event, pokemon: PokemonSpecies) {
	if(!e?.target) {
		return;
	}
	
	const correctedName = `https://play.pokemonshowdown.com/sprites/ani/${failedSprites[pokemon.name]}.gif`;
	if(!triedSprites.value.includes(correctedName)) {
		(e.target as HTMLImageElement).src = correctedName;
		triedSprites.value.push(correctedName);
		return;
	}
	
	const defaultSprite = `https://play.pokemonshowdown.com/sprites/gen5/${pokemon.name}.png`;
	if(!triedSprites.value.includes(defaultSprite)) {
		(e.target as HTMLImageElement).src = defaultSprite;
		triedSprites.value.push(defaultSprite);
	}
}

</script>

<template>
	<h1>¡Hola!</h1>
	<div
		v-for="(pokemon, index) in pokemonList"
		:key="index"
	>
		<img
			loading="lazy"
			:src="`https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif`"
			alt="Sprite"
			@error="replaceWithDefaultSprite($event, pokemon)"
		>
		{{ pokemon.order }} - {{ pokemon.name }}
	</div>
	
	<button @click="getPokemonBatch()">
		Next page!
	</button>
</template>

<style scoped lang="scss">

</style>
