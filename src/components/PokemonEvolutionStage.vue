<script setup lang="ts">
import { computed, onUpdated, ref } from "vue";
import { NamedAPIResource } from "@/models/Common";
import { capitalize } from "@/utils/strings";
import { useFailedImg } from "@/composables/failedImg";

const props = defineProps<{
	species: NamedAPIResource;
}>();

const { clearTriesList, replaceUsingName } = useFailedImg();
onUpdated(() => clearTriesList());
const animatedSprite = ref(`https://play.pokemonshowdown.com/sprites/ani/${props.species.name}.gif`);
const id = computed(() => String(props.species.url.split('/').slice(-2)[0]).padStart(3, '0'));
</script>

<template>
	<RouterLink
		:to="'/' + species.name"
		class="stage"
	>
		<div class="img-wrapper">
			<img
				:src="animatedSprite"
				:alt="'Sprite de ' + species.name"
				@error="replaceUsingName($event, species.name)"
			>
		</div>
		<span>#{{ id }}</span>
		<h4>{{ capitalize(species.name) }}</h4>
	</RouterLink>
</template>

<style scoped lang="scss">
.img-wrapper {
	width: 100px;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	
	img {
		max-width: 100%;
		max-height: 100%;
	}
}

span {
	position: absolute;
	bottom: 7px;
	left: 30%;
	transform: translateX(-50%);
	font-family: 'Kaushan Script', cursive;
	color: var(--color-text-alpha);
	z-index: 0;
	font-weight: bold;
}

h4 {
	margin-top: 10px;
	z-index: 1;
	text-align: center;
}
</style>
