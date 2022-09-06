<script setup lang="ts">
import { Pokemon, PokemonWithSpecie } from "@/models/Pokemon";
import { useFailedImg } from "@/composables/failedImg";
import { onUpdated, ref } from "vue";

const props = defineProps<{
	pokemon: Pokemon | PokemonWithSpecie;
	imageName?: string;
}>();

const { replaceWithDefaultSprite, clearTriesList } = useFailedImg();
onUpdated(() => clearTriesList());

const image = ref(`https://play.pokemonshowdown.com/sprites/ani/${props.imageName || props.pokemon?.species?.name}.gif`);
</script>

<template>
	<img
		v-if="pokemon"
		loading="lazy"
		:src="image"
		:alt="'Sprite de ' + pokemon.species?.name"
		@error="replaceWithDefaultSprite($event, pokemon)"
	>
</template>
