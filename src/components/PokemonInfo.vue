<script setup lang="ts">
import { PokemonWithSpecie } from "@/models/Pokemon";
import IconType from "@/components/icons/IconType.vue";
import IconMale from "@/components/icons/IconMale.vue";
import IconFemale from "@/components/icons/IconFemale.vue";
import IconPokeball from "@/components/icons/IconPokeball.vue";
import { capitalize, translateFlavorText } from "@/utils/strings";
import { Generation } from "@/models/Game";

defineProps<{
	pokemon: PokemonWithSpecie;
	generation?: Generation
}>();
</script>

<template>
	<div>
		<div class="row">
			<div class="pokemon-data-info pokemon-data-type">
				<h3>Tipo{{ pokemon.types.length > 1 ? 's' : '' }}</h3>
				<div class="pokemon-types">
					<IconType
						v-for="(type, index) in pokemon.types"
						:key="index"
						:pokemon-type="type.type.name"
						class="pokemon-type"
					/>
				</div>
			</div>
			
			<div class="pokemon-data-info pokemon-data-description">
				<h3>Descripción</h3>
				<span class="description">
					{{ translateFlavorText(pokemon.flavor_text_entries || []) }}
				</span>
			</div>
		</div>
		
		<div class="row">
			<div class="pokemon-data-info pokemon-data-id">
				<h3>Número</h3>
				<span>#{{ String(pokemon.id).padStart(3, '0') }}</span>
			</div>
			
			<div
				v-if="generation"
				class="pokemon-data-info pokemon-data-generation"
			>
				<h3>Región</h3>
				<span>{{ capitalize(generation.main_region.name) }}</span>
			</div>
			
			<div class="pokemon-data-info pokemon-data-height">
				<h3>Altura</h3>
				<span>{{ (pokemon.height/10).toFixed(1) }}m</span>
			</div>
			
			<div class="pokemon-data-info pokemon-data-weight">
				<h3>Peso</h3>
				<span>{{ (pokemon.weight/10).toFixed(1) }}kg</span>
			</div>
		</div>
		
		<div class="row">
			<div class="pokemon-data-info pokemon-data-genders">
				<h3>Ratio de géneros</h3>
				<div
					v-if="pokemon.gender_rate !== -1"
					class="genders"
				>
					<div class="gender">
						<IconMale class="male" />
						<span>{{ 100 - (pokemon.gender_rate * 100 / 8) }}%</span>
					</div>
					<span>/</span>
					<div class="gender">
						<IconFemale class="female" />
						<span>{{ pokemon.gender_rate * 100 / 8 }}%</span>
					</div>
				</div>
				<div v-else>
					Desconocido
				</div>
			</div>
			
			<div class="pokemon-data-info pokemon-data-shape">
				<h3>Forma</h3>
				<div
					v-if="pokemon.shape"
					class="shape"
				>
					<img
						:src="`shapes/${pokemon.shape.name}.webp`"
						:alt="'Forma de ' + pokemon.name"
					>
				</div>
			</div>
			
			<div class="pokemon-data-info pokemon-data-catch">
				<h3>Ratio de captura</h3>
				<div class="catch-rate">
					<IconPokeball class="icon" />
					<span>{{ (pokemon.capture_rate * 100 / 255).toFixed(2) }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.row {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
}

.pokemon-data-info {
	display: flex;
	flex-direction: column;
	gap: 5px;
	
	&:not(:last-child) {
		margin-right: 30px;
	}
	
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

.pokemon-types {
	margin: 5px 0;
	display: flex;
	gap: 5px;
	
	.pokemon-type {
		width: 35px;
		height: 35px;
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
</style>
