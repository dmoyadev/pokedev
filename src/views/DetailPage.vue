<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import { PokemonWithSpecie } from "@/models/Pokemon";
import { capitalize, translate, translateGenus } from "@/utils/strings";
import { flattenObject } from "@/utils/object";
import PokemonImage from "@/components/PokemonImage.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import PokemonStats from "@/components/PokemonStats.vue";
import PokemonInfo from "@/components/PokemonInfo.vue";
import { useFetchGenerations } from "@/composables/fetchGenerations";

// Get Pokémon data
const route = useRoute();
const pokemonName = ref(route.params.name);
const pokemon = ref<PokemonWithSpecie>();
const { generations } = useFetchGenerations();
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
			<!-- Back button -->
			<RouterLink
				to="#"
				@click="$router.go(-1)"
			>
				<IconArrowLeft class="icon" />
			</RouterLink>
			
			<!-- Pokémon icon -->
			<img
				v-if="pokemon?.sprites?.versions?.['generation-viii']?.['icons']?.front_default"
				:src="pokemon?.sprites?.versions?.['generation-viii']?.['icons']?.front_default"
				:alt="'Sprite de ' + pokemon?.name"
			>
			
			<!-- Pokémon name -->
			<span>
				{{ capitalize(translate(pokemon?.names || [])) }}
				·
				<em>{{ translateGenus(pokemon?.genera || []) }}</em>
			</span>
		</header>
		
		<!-- Pokémon image -->
		<aside class="pokemon">
			<PokemonImage
				v-if="pokemon"
				class="pokemon-image"
				:not-animated="true"
				type="artwork"
				:pokemon="pokemon"
			/>
			
			<h1>
				{{ '#' + String(pokemon?.id).padStart(3, '0') }}
				{{ capitalize(translate(pokemon?.names || [])) }}
			</h1>
			<!-- Pokémon genera -->
			<h2>{{ capitalize(translate(pokemon?.names || [], 'ja')) }}</h2>
		</aside>
		
		<!-- Pokémon info -->
		<section
			v-if="pokemon"
			class="pokemon-info"
		>
			<h3 class="title">
				Información básica
			</h3>
			
			<PokemonInfo
				class="content"
				:pokemon="pokemon"
				:generation="generations.find(gen => gen.name === pokemon?.generation.name)"
			/>
		</section>
		
		<!-- Pokémon stats -->
		<PokemonStats
			v-if="pokemon"
			class="content"
			:pokemon="pokemon"
		/>
		
		<!-- Pokémon forms -->
		<section
			v-if="pokemonVarieties.length > 1"
			class="pokemon-varieties"
		>
			<h3 class="title">
				Formas:
			</h3>
			
			<div class="content">
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
			</div>
		</section>
		
		<section
			v-if="Object.values(pokemonSprites).length"
			class="pokemon-sprites"
		>
			<h3 class="title">
				Sprites:
			</h3>
			
			<div class="content">
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
@import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');

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
		clip-path: circle(150px at calc(100% - 150px) 100px);
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
		top: 25px;
		right: 30px;
		font-weight: 800;
		font-style: italic;
		color: rgba(255, 255, 255, 0.1);
	}
}

main {
	display: grid;
	grid-template-columns: auto minmax(auto, 350px);
	grid-template-rows: repeat(5, auto);
	gap: 20px 50px;
	grid-template-areas:
    "header             pokemon"
    "pokemon-info       pokemon"
    "pokemon-stats      pokemon-stats"
    "pokemon-varieties  pokemon-varieties"
    "pokemon-sprites    pokemon-sprites";
	
	header { grid-area: header; }
	.pokemon { grid-area: pokemon; }
	.pokemon-info { grid-area: pokemon-info; }
	.pokemon-stats { grid-area: pokemon-stats; }
	.pokemon-varieties { grid-area: pokemon-varieties; }
	.pokemon-sprites { grid-area: pokemon-sprites; }
}

header {
	min-width: 335px;
	display: flex;
	align-items: center;
	
	a {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		min-width: 40px;
		
		&:hover {
			border-radius: 50%;
			background-color: var(--color-hover);
		}
		
		.icon {
			width: 16px;
		}
	}
	
	img {
		margin-right: 5px;
		max-height: 50px;
		position: relative;
		top: -10px;
	}
	
	span {
		font-size: 24px;
		font-weight: bold;
		white-space: nowrap;
	}
}

.pokemon {
	display: flex;
	flex-direction: column;
	gap: 10px;
	
	.pokemon-image {
		z-index: 10;
		width: 250px;
		height: 250px;
	}
	
	h1 {
		font-weight: bold;
		font-size: 40px;
		text-align: right;
		z-index: 1;
	}
	
	h2 {
		font-family: 'Kaushan Script', cursive;
		color: var(--color-text-alpha);
		font-size: 50px;
		position: relative;
		top: -20px;
		z-index: 0;
		line-height: .8;
	}
}

section {
	background: var(--color-background-card);
	padding: 20px;
	
	.title {
		font-size: 16px;
		text-transform: uppercase;
		font-weight: bold;
		margin-bottom: 20px;
	}
	
	.content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
}

.pokemon-info {
	min-width: 335px;
}

/* Pokémon Sprites */
.pokemon-sprites .content,
.pokemon-varieties .content {
	display: flex;
	flex-direction: row;
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
