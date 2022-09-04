<script setup lang="ts">
import { onUpdated } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useFailedImg } from "@/composables/failedImg";
import IconType from "@/components/icons/IconType.vue";

defineProps<{
	pokemon?: Pokemon,
	isLoading?: boolean,
}>();

const { replaceWithDefaultSprite, clearTriesList } = useFailedImg();
onUpdated(() => clearTriesList());

const capitalize = (str: string) => str.replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());
</script>

<template>
	<RouterLink
		v-if="pokemon && pokemon?.id"
		:to="pokemon.name"
		class="card"
		:class="'type-' + pokemon?.types[0].type.name"
		:data-number="'#' + String(pokemon?.id).padStart(3, '0')"
	>
		<div class="pokemon-image">
			<img
				loading="lazy"
				:src="`https://play.pokemonshowdown.com/sprites/ani/${pokemon.species?.name}.gif`"
				:alt="'Sprite ' + pokemon.species?.name"
				@error="replaceWithDefaultSprite($event, pokemon)"
			>
		</div>
		
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
	color: currentColor;
	
	&:before{
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		clip-path: circle(60px at 80% 20%);
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
	
	&:after{
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
