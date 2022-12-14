<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import { PokemonSpeciesVariety, PokemonWithSpecie } from "@/models/Pokemon";
import { capitalize, translate, translateGenus } from "@/utils/strings";
import PokemonImage from "@/components/PokemonImage.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import PokemonStats from "@/components/PokemonStats.vue";
import PokemonInfo from "@/components/PokemonInfo.vue";
import { useFetchGenerations } from "@/composables/fetchGenerations";
import { APIResource } from "@/models/Common";
import { useFetchData } from "@/composables/fetchData";
import PokemonEvolutionChain from "@/components/PokemonEvolutionChain.vue";
import { EvolutionChain } from "@/models/Evolution";
import PokemonSprites from "@/components/PokemonSprites.vue";

// Get Pokémon data
const route = useRoute();
const pokemonName = ref(route.params.name);
const pokemon = ref<PokemonWithSpecie>();
const { generations } = useFetchGenerations();
async function loadPokemonDetails() {
	const { pokemon: data } = await useFetchPokemon(pokemonName.value as string, true);
	if(!data.value) return;
	
	pokemon.value = data.value;
	getVarieties(pokemon.value.varieties);
	if(pokemon.value?.evolution_chain) {
		await getEvolutionChain(pokemon.value.evolution_chain);
	}
}

// Pokémon varieties
const pokemonVarieties = ref<PokemonWithSpecie[]>([]);
function getVarieties(varieties: PokemonSpeciesVariety[]) {
	varieties.forEach(({ pokemon: { name } }) => {
		useFetchPokemon(name, true)
			.then(({ pokemon: dataVariety }) => {
				if(dataVariety.value) {
					pokemonVarieties.value.push(dataVariety.value);
				}
			});
	});
}

//Pokémon evolution chain
const evolutionChain = ref<EvolutionChain>();
function getEvolutionChain(evolution: APIResource) {
	useFetchData(evolution.url)
		.then(({ data }) => {
			evolutionChain.value = data.value;
		});
}

// Init
loadPokemonDetails();

const typesGradient = computed(() => {
	if (!pokemon.value?.types?.length) return "";
	
	const colors = pokemon.value.types.map((type) => {
		return `var(--color-type-${type.type.name}-diff)`;
	});
	
	return colors.length > 1
		? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 50%, ${colors[1]} 50%, ${colors[1]} 100%)`
		: colors;
});
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
		
		<section
			v-if="evolutionChain"
			class="pokemon-evolution-chain"
		>
			<h3 class="title">
				Cadena de evolución
			</h3>
			
			<PokemonEvolutionChain
				v-if="evolutionChain"
				:evolution="evolutionChain?.chain"
			/>
		</section>
		
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
					<div class="img-wrapper">
						<PokemonImage
							class="image"
							:pokemon="variety"
							:image-name="variety.name"
						/>
					</div>
					<h4>{{ capitalize(variety.name).replaceAll('-', ' ').replaceAll('Gmax', 'GigaMax') }}</h4>
				</RouterLink>
			</div>
		</section>
		
		<section
			v-if="pokemon?.sprites"
			class="pokemon-sprites"
		>
			<h3 class="title">
				Sprites:
			</h3>
			
			<PokemonSprites
				:pokemon-type="pokemon?.types[0].type.name"
				:pokemon-sprites="pokemon?.sprites"
				:generations="generations"
			/>
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
		top: -80px;
		right: -30px;
		width: 300px;
		height: 300px;
		border-radius: 50%;
		background: v-bind(typesGradient);
		transition: 0.5s ease-in-out;
	}
	
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
	grid-template-rows: repeat(6, auto);
	gap: 20px 50px;
	grid-template-areas:
    "header                     pokemon"
    "pokemon-info               pokemon"
    "pokemon-evolution-chain    pokemon-evolution-chain"
    "pokemon-stats              ."
    "pokemon-varieties          pokemon-varieties"
    "pokemon-sprites            pokemon-sprites";
	
	header { grid-area: header; }
	.pokemon { grid-area: pokemon; }
	.pokemon-info { grid-area: pokemon-info; }
	.pokemon-stats { grid-area: pokemon-stats; }
	.pokemon-evolution-chain { grid-area: pokemon-evolution-chain; }
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

.pokemon-varieties {
	.content {
		gap: 20px;
	}
	
	.img-wrapper {
		width: 200px;
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.image {
			max-height: 100%;
			max-width: 100%;
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
}
</style>
