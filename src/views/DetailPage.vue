<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useFetchPokemon } from "@/composables/fetchPokemon";
import { PokemonWithSpecie } from "@/models/Pokemon";
import { capitalize, translate, translateFlavorText, translateGenus } from "@/utils/strings";
import PokemonImage from "@/components/PokemonImage.vue";
import IconType from "@/components/icons/IconType.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import PokemonStats from "@/components/PokemonStats.vue";
import { flattenObject } from "@/utils/object";
import IconMale from "@/components/icons/IconMale.vue";
import IconFemale from "@/components/icons/IconFemale.vue";
import IconPokeball from "@/components/icons/IconPokeball.vue";

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
			<h1>{{ capitalize(translate(pokemon?.names || [])) }}</h1>
		</header>
		<h2>{{ translateGenus(pokemon?.genera || []) }}</h2>
		
		<PokemonImage
			class="pokemon-image"
			:pokemon="pokemon"
			:image-name="String(pokemonName)"
		/>
		
		<section class="pokemon-info">
			<h3 class="title">
				Información básica
			</h3>
			
			<div class="content">
				<div class="row">
					<div class="pokemon-data-info pokemon-data-type">
						<h3>Tipo{{ pokemon?.types.length > 1 ? 's' : '' }}</h3>
						<div class="pokemon-types">
							<IconType
								v-for="(type, index) in pokemon?.types"
								:key="index"
								:pokemon-type="type.type.name"
								class="pokemon-type"
							/>
						</div>
					</div>
					
					<div class="pokemon-data-info pokemon-data-description">
						<h3>Descripción</h3>
						<span class="description">
							{{ translateFlavorText(pokemon?.flavor_text_entries || []) }}
						</span>
					</div>
				</div>
				
				<div class="row">
					<div class="pokemon-data-info pokemon-data-id">
						<h3>Número</h3>
						<span>#{{ String(pokemon?.id).padStart(3, '0') }}</span>
					</div>
					
					<div class="pokemon-data-info pokemon-data-height">
						<h3>Altura</h3>
						<span>{{ (pokemon?.height/10).toFixed(1) }}m</span>
					</div>
					
					<div class="pokemon-data-info pokemon-data-weight">
						<h3>Peso</h3>
						<span>{{ (pokemon?.weight/10).toFixed(1) }}kg</span>
					</div>
					
					<div class="pokemon-data-info pokemon-data-shape">
						<h3>Forma</h3>
						<div
							v-if="pokemon?.shape"
							class="shape"
						>
							<img
								:src="`shapes/${pokemon.shape.name}.webp`"
								:alt="'Forma de ' + pokemon?.name"
							>
						</div>
					</div>
				</div>
				
				<div class="row">
					<div class="pokemon-data-info pokemon-data-genders">
						<h3>Ratio de géneros</h3>
						<div
							v-if="pokemon?.gender_rate !== -1"
							class="genders"
						>
							<div class="gender">
								<IconMale class="male" />
								<span>{{ 100 - (pokemon?.gender_rate * 100 / 8) }}%</span>
							</div>
							<span>/</span>
							<div class="gender">
								<IconFemale class="female" />
								<span>{{ pokemon?.gender_rate * 100 / 8 }}%</span>
							</div>
						</div>
						<div v-else>
							Desconocido
						</div>
					</div>
					
					<div class="pokemon-data-info pokemon-data-catch">
						<h3>Ratio de captura</h3>
						<div class="catch-rate">
							<IconPokeball class="icon" />
							<span>{{ (pokemon?.capture_rate * 100 / 255).toFixed(2) }}%</span>
						</div>
					</div>
				</div>
			</div>
		</section>
		
		<section class="pokemon-stats">
			<h3 class="title">
				Estadísticas
			</h3>
			
			<PokemonStats
				class="content"
				:pokemon="pokemon"
			/>
		</section>
		
		<section
			v-if="pokemonVarieties.length > 1"
			class="pokemon-varieties"
		>
			<h3 class="title">
				Variedades:
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
				Otros sprites:
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

section {
	background: var(--color-background-card);
	padding: 20px;
	
	.title {
		font-size: 16px;
		text-transform: uppercase;
		font-weight: bold;
		margin-bottom: 20px;
	}
}

/* Pokémon Data */
.pokemon-info {
	max-width: 450px;
	
	.content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		
		.row {
			display: flex;
			justify-content: space-between;
			gap: 20px;
		}
	}
	
	.pokemon-data-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
		
		h3 {
			font-weight: bold;
			text-transform: uppercase;
			font-size: 10px;
			margin: 0;
			
			.icon {
				height: 12px;
			}
		}
		
		span {
			font-size: 22px;
			font-weight: lighter;
		}
	}
	
	.pokemon-data-type {
		width: 25%;
		
		.pokemon-types {
			margin: 5px 0;
			display: flex;
			gap: 5px;
			
			.pokemon-type {
				width: 35px;
				height: 35px;
			}
		}
	}
	
	.pokemon-data-description {
		flex: 1;
		
		.description {
			font-size: 18px !important;
			font-style: italic;
		}
	}
	
	.shape {
		width: 25px;
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		img {
			max-width: 100%;
			max-height: 100%;
		}
	}
	
	.genders {
		display: flex;
		gap: 10px;
		justify-content: center;
		
		.gender {
			display: flex;
			align-items: center;
			gap: 5px;
		}
		
		.male, .female {
			width: 20px;
			height: 20px;
			color: cornflowerblue;
		}
		
		.female {
			color: hotpink;
		}
	}
	
	.catch-rate {
		display: flex;
		align-items: center;
		gap: 5px;
		
		.icon {
			width: 20px;
			height: 20px;
		}
	}
}

/* Pokémon Sprites */
.pokemon-sprites .content {
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
