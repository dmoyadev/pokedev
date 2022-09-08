<script setup lang="ts">
import { Pokemon, PokemonWithSpecie } from "@/models/Pokemon";
import { useFailedImg } from "@/composables/failedImg";
import { computed, onUpdated, ref } from "vue";

const props = defineProps<{
	pokemon: Pokemon | PokemonWithSpecie;
	imageName?: string;
	notAnimated?: boolean;
	type?: 'artwork';
}>();

const { replaceWithDefaultSprite, clearTriesList } = useFailedImg();
onUpdated(() => clearTriesList());

const animatedSprite = ref(`https://play.pokemonshowdown.com/sprites/ani/${props.imageName || props.pokemon?.species?.name}.gif`);
const otherImageUrl = computed(() => {
	let url;
	switch(props.type) {
	case 'artwork':
		url = props.pokemon?.sprites?.other?.['official-artwork']?.front_default;
		break;
	default:
		url = props.pokemon?.sprites?.front_default;
	}
	
	return url ? url : animatedSprite.value;
});
const image = ref(props.notAnimated
	? otherImageUrl
	: animatedSprite.value
);
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
