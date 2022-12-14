<script setup lang="ts">
import { Pokemon } from "@/models/Pokemon";
import { capitalize } from "@/utils/strings";
import IconType from "@/components/icons/IconType.vue";
import PokemonImage from "@/components/PokemonImage.vue";
import { computed } from "vue";

const props = defineProps<{
	pokemon?: Pokemon,
}>();

const typesGradient = computed(() => {
	if (!props.pokemon?.types?.length) return "";
	
	const colors = props.pokemon.types.map((type) => {
		return `var(--color-type-${type.type.name}-diff)`;
	});
	
	return colors.length > 1
		? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 60%, ${colors[1]} 60%, ${colors[1]} 100%)`
		: colors;
});
</script>

<template>
	<RouterLink
		v-if="pokemon && pokemon?.id"
		:to="pokemon.name"
		class="card"
		:class="'type-' + pokemon?.types[0].type.name"
		:data-number="'#' + String(pokemon?.id).padStart(3, '0')"
	>
		<PokemonImage
			class="pokemon-image"
			:pokemon="pokemon"
		/>
		
		<h2 class="pokemon-name">
			{{ capitalize(pokemon.species?.name) }}
		</h2>
		<div class="pokemon-types">
			<IconType
				v-for="(type, index) in pokemon.types"
				:key="index"
				:pokemon-type="type.type.name"
				class="pokemon-type"
			/>
		</div>
		
		<div class="hidden pokemon-data">
			<div class="pokemon-data-info">
				<h3>Altura</h3>
				<span>{{ (pokemon.height/10).toFixed(1) }}m</span>
			</div>
			<div class="pokemon-data-info right">
				<h3>Peso</h3>
				<span>{{ (pokemon.weight/10).toFixed(1) }}kg</span>
			</div>
		</div>
	</RouterLink>
	<section
		v-else
		class="card type-normal"
		data-number="#???"
	>
		<div class="pokemon-image">
			<img
				loading="lazy"
				src="https://play.pokemonshowdown.com/sprites/ani/substitute.gif"
				alt="Sprite de un sustituto"
			>
		</div>
		<h2 class="pokemon-name">
			Cargando...
		</h2>
	</section>
</template>

<style scoped lang="scss">
.card {
	position: relative;
	height: 150px;
	background: var(--color-background-card);
	cursor: pointer;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		clip-path: circle(60px at 80% 20%);
		background: v-bind(typesGradient);
		transition: 0.5s ease-in-out;
	}
	
	&:after {
		content: attr(data-number);
		position: absolute;
		font-size: 80px;
		font-weight: 800;
		font-style: italic;
		color: rgba(255, 255, 255, 0.1);
	}
}

.card:hover {
	&:before {
		clip-path: circle(100% at 50% 50%);
	}
	
	.pokemon-name {
		bottom: 50px;
	}
	
	.pokemon-image {
		bottom: 80%;
		left: 80%;
	}
	
	.pokemon-data {
		bottom: 10px;
		opacity: 1;
		visibility: visible;
	}
}

.pokemon-name {
	position: absolute;
	bottom: 10px;
	left: 10px;
	transition: 0.5s;
	z-index: 10;
	font-weight: bold;
	font-size: 24px;
}

.pokemon-types {
	position: absolute;
	top: 10px;
	left: 10px;
	
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5px;
	
	.pokemon-type {
		width: 20px;
		height: 20px;
	}
}

.pokemon-image {
	position: absolute;
	left: 50%;
	bottom: 50%;
	transform: translateY(50%) translateX(-50%);
	transition: 0.5s;
	display: grid;
	place-items: center;
	z-index: 1;
}

.pokemon-data {
	position: absolute;
	visibility: hidden;
	opacity: 0;
	bottom: 0;
	left: 10px;
	right: 10px;
	width: calc(100% - 20px);
	transition: 0.5s;
	display: flex;
	justify-content: space-between;
	
	.pokemon-data-info {
		display: flex;
		flex-direction: column;
		
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
		
		&.right {
			text-align: right;
		}
	}
}
</style>
