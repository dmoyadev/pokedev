<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import { PokemonWithSpecie } from "@/models/Pokemon";
import { capitalize, translate, translateFlavorText } from "@/utils/strings";
import PokemonImage from "@/components/PokemonImage.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import PokemonStats from "@/components/PokemonStats.vue";
import { flattenObject } from "@/utils/object";

// Get Pokémon data
const route = useRoute();
const pokemonName = ref(route.params.name);
const pokemon = ref<PokemonWithSpecie>();
const pokemonVarieties = ref<PokemonWithSpecie[]>([]);
async function loadPokemonDetails() {
	const { pokemon: data } = await useFetchPokemon(pokemonName.value as string, true);
	pokemon.value = data.value;
	pokemon.value?.varieties?.forEach(({ pokemon: { name } }) => {
		useFetchPokemon(name, true)
			.then(({ pokemon: dataVariety }) => {
				if(dataVariety.value) {
					pokemonVarieties.value.push(dataVariety.value);
				}
			});
	});
}

const pokemonSprites = computed(() => flattenObject(pokemon.value?.sprites || {}));

// Init
loadPokemonDetails();
</script>

<template>
	<main
		:class="'type-' + pokemon?.types[0].type.name"
		:data-number="'#' + String(pokemon?.id).padStart(3, '0')"
	>
		<header>
			<RouterLink to="/">
				<IconArrowLeft class="icon" />
			</RouterLink>
			<img
				v-if="pokemon?.sprites?.versions?.['generation-viii']?.['icons']?.front_default"
				:src="pokemon?.sprites?.versions?.['generation-viii']?.['icons']?.front_default"
				:alt="'Sprite de ' + pokemon?.name"
			>
			<h1>{{ capitalize(translate(pokemon?.names)) }}</h1>
		</header>
		
		<PokemonImage
			class="pokemon-image"
			:pokemon="pokemon"
			:image-name="String(pokemonName)"
		/>
		
		<PokemonStats
			class="stats"
			:pokemon="pokemon"
		/>
		
		{{ translateFlavorText(pokemon?.flavor_text_entries || '') }}
		
		<section v-if="pokemonVarieties.length > 1">
			<h2>Variedades:</h2>
			<RouterLink
				v-for="(variety, index) in pokemonVarieties"
				:key="index"
				:to="variety.name"
			>
				<PokemonImage
					class="image"
					:pokemon="variety"
					:image-name="variety.name"
				/>
			</RouterLink>
		</section>
		
		<section v-if="Object.values(pokemonSprites).length">
			<h2>Otros sprites:</h2>
			<div class="sprites">
				<div
					v-for="(sprite, index) in pokemonSprites"
					:key="index"
					class="img-wrapper"
				>
					<img
						class="image"
						:src="sprite"
						:alt="'Sprite de ' + pokemon?.name"
					>
				</div>
			</div>
		</section>
	</main>
</template>

<style scoped lang="scss">
main {
	background: var(--color-background);
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 20px;
	
	&:before {
		content: '';
		position: absolute;
		top: -30px;
		right: -30px;
		width: 100%;
		height: 100%;
		clip-path: circle(150px at calc(80% - 30px) 100px);
		transition: 0.5s ease-in-out;
	}
	
	&.type-bug:before { background: var(--color-type-bug-diff); }
	&.type-dark:before { background: var(--color-type-dark-diff); }
	&.type-dragon:before { background: var(--color-type-dragon-diff); }
	&.type-electric:before { background: var(--color-type-electric-diff); }
	&.type-fire:before { background: var(--color-type-fire-diff); }
	&.type-fairy:before { background: var(--color-type-fairy-diff); }
	&.type-fighting:before { background: var(--color-type-fighting-diff); }
	&.type-flying:before { background: var(--color-type-flying-diff); }
	&.type-ghost:before { background: var(--color-type-ghost-diff); }
	&.type-grass:before { background: var(--color-type-grass-diff); }
	&.type-ground:before { background: var(--color-type-ground-diff); }
	&.type-ice:before { background: var(--color-type-ice-diff); }
	&.type-normal:before { background: var(--color-type-normal-diff); }
	&.type-poison:before { background: var(--color-type-poison-diff); }
	&.type-psychic:before { background: var(--color-type-psychic-diff); }
	&.type-rock:before { background: var(--color-type-rock-diff); }
	&.type-steel:before { background: var(--color-type-steel-diff); }
	&.type-water:before { background: var(--color-type-water-diff); }
	
	&:after {
		content: attr(data-number);
		position: absolute;
		font-size: 80px;
		top: 20px;
		right: calc(15% - 30px);
		font-weight: 800;
		font-style: italic;
		color: rgba(255, 255, 255, 0.1);
	}
	
	.pokemon-image {
		position: absolute;
		top: 20px;
		right: 15%;
		z-index: 10;
	}
}

header {
	display: flex;
	align-items: center;
	
	a {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.icon {
		width: 16px;
		margin-right: 10px;
	}
	
	img {
		margin-right: 5px;
		max-height: 50px;
		position: relative;
		top: -10px;
	}
	
	h1 {
		font-size: 24px;
		font-weight: bold;
	}
}

.sprites {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	align-items: center;
	justify-content: space-between;
	
	.img-wrapper {
		width: 100px;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.image {
			max-height: 100%;
			max-width: 100%;
		}
	}
}
</style>
