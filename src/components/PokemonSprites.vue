<script setup lang="ts">
import { computed, ref } from "vue";
import { PokemonSprites } from "@/models/Pokemon";
import { Generation } from "@/models/Game";
import { translate } from "@/utils/strings";
import { flattenObject } from "@/utils/object";

const props = defineProps<{
	pokemonType: string;
	pokemonSprites: PokemonSprites;
	generations: Generation[];
}>();

function hasSprites(sprites) {
	return Object.values(sprites).some(sprite => sprite);
}

const spritesByGen = computed(() => {
	if(!props.pokemonSprites?.versions) return [];
	
	const icons: any = [];
	const generations = Object.entries(props.pokemonSprites.versions)
		.map(([gen, sprites]) => {
			const generation = props.generations.find(({ name }) => name === gen);
			const parsedSprites = Object.entries(sprites)
				.map(([name, gameSprites]) => {
					if(name === 'icons') {
						if(hasSprites(gameSprites)) {
							icons.push({
								name: generation ? translate(generation.names) : gen,
								sprites: gameSprites
							});
						}
					} else {
						return {
							name,
							gameSprites
						};
					}
				})
				.filter(n => n && hasSprites(n.gameSprites));
			return {
				name: generation ? translate(generation.names) : gen,
				sprites: parsedSprites
			};
		})
		.filter(n => n.sprites.length);
	
	return [
		...generations.filter(n => n.sprites.length),
		{
			name: 'Iconos',
			sprites: icons
		}
	];
});

const selectedGen = ref(0);
const selectedGame = ref(spritesByGen.value[0].sprites[0].name || '');
function selectGen(index: number) {
	selectedGen.value = index;
	selectedGame.value = spritesByGen.value[index].sprites[0].name;
}
const spritesByGame = computed(() => {
	if(!spritesByGen.value.length) return [];
	
	const generation = spritesByGen.value[selectedGen.value];
	return (generation.name === 'Iconos')
		? flattenObject(generation.sprites.find(({ name }) => name === selectedGame.value)?.sprites) || []
		: flattenObject(generation.sprites.find(({ name }) => name === selectedGame.value)?.gameSprites) || [];
});
</script>

<template>
	<div class="pokemon-sprites">
		<div class="generations-tabs">
			<button
				v-for="({ name }, index) in spritesByGen"
				:key="index"
				class="tab"
				:class="{ ['type-' + pokemonType + ' active']: index === selectedGen }"
				@click="selectGen(index)"
			>
				{{ name }}
			</button>
		</div>
		
		<div class="generation-sprites">
			<div class="games-tabs">
				<template v-if="spritesByGen[selectedGen].name !== 'Iconos'">
					<button
						v-for="(game, index) in spritesByGen[selectedGen].sprites"
						:key="index"
						class="tab"
						:class="{ ['type-' + pokemonType + ' active']: game?.name === selectedGame }"
						@click="selectedGame = game.name"
					>
						<span class="games-box-wrapper">
							<img
								:src="'/games/' + game.name + '.webp'"
								:alt="game.name"
							>
						</span>
					</button>
				</template>
				
				<template v-else>
					<button
						v-for="(generation, index) in spritesByGen[selectedGen].sprites"
						:key="index"
						class="tab"
						:class="{ ['type-' + pokemonType + ' active']: generation.name === selectedGame }"
						@click="selectedGame = generation.name"
					>
						{{ generation.name }}
					</button>
				</template>
			</div>
			
			<div class="sprites">
				<div
					v-for="(sprite, index) in spritesByGame"
					:key="index"
					class="sprite"
				>
					<img
						:src="sprite"
						:alt="sprite"
					>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.pokemon-sprites {
	display: flex;
	gap: 10px;
	
	.generations-tabs {
		min-width: 100px;
		max-width: 150px;
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: var(--color-background);
		padding: 10px;
		
		.tab {
			background: transparent;
			color: white;
			border: none;
			padding: 10px 5px;
			text-align: left;
			cursor: pointer;
			
			&.active {
				font-weight: bold;
				
				&.type-bug { background: var(--color-type-bug-diff); }
				&.type-dark { background: var(--color-type-dark-diff); }
				&.type-dragon { background: var(--color-type-dragon-diff); }
				&.type-electric { background: var(--color-type-electric-diff); }
				&.type-fire { background: var(--color-type-fire-diff); }
				&.type-fairy { background: var(--color-type-fairy-diff); }
				&.type-fighting { background: var(--color-type-fighting-diff); }
				&.type-flying { background: var(--color-type-flying-diff); }
				&.type-ghost { background: var(--color-type-ghost-diff); }
				&.type-grass { background: var(--color-type-grass-diff); }
				&.type-ground { background: var(--color-type-ground-diff); }
				&.type-ice { background: var(--color-type-ice-diff); }
				&.type-normal { background: var(--color-type-normal-diff); }
				&.type-poison { background: var(--color-type-poison-diff); }
				&.type-psychic { background: var(--color-type-psychic-diff); }
				&.type-rock { background: var(--color-type-rock-diff); }
				&.type-steel { background: var(--color-type-steel-diff); }
				&.type-water { background: var(--color-type-water-diff); }
			}
			
			&:hover {
				background: var(--color-hover);
			}
		}
	}
	
	.generation-sprites {
		flex: 2;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.games-tabs {
		display: flex;
		flex-wrap: wrap;
		background-color: var(--color-background);
		
		.tab {
			min-width: 150px;
			padding: 10px 10px 5px;
			flex: 1;
			background: transparent;
			color: white;
			border: none;
			border-bottom: 5px solid transparent;
			cursor: pointer;
			
			&.active {
				background: var(--color-hover);
				font-weight: bold;
				
				&.type-bug { border-color: var(--color-type-bug-diff); }
				&.type-dark { border-color: var(--color-type-dark-diff); }
				&.type-dragon { border-color: var(--color-type-dragon-diff); }
				&.type-electric { border-color: var(--color-type-electric-diff); }
				&.type-fire { border-color: var(--color-type-fire-diff); }
				&.type-fairy { border-color: var(--color-type-fairy-diff); }
				&.type-fighting { border-color: var(--color-type-fighting-diff); }
				&.type-flying { border-color: var(--color-type-flying-diff); }
				&.type-ghost { border-color: var(--color-type-ghost-diff); }
				&.type-grass { border-color: var(--color-type-grass-diff); }
				&.type-ground { border-color: var(--color-type-ground-diff); }
				&.type-ice { border-color: var(--color-type-ice-diff); }
				&.type-normal { border-color: var(--color-type-normal-diff); }
				&.type-poison { border-color: var(--color-type-poison-diff); }
				&.type-psychic { border-color: var(--color-type-psychic-diff); }
				&.type-rock { border-color: var(--color-type-rock-diff); }
				&.type-steel { border-color: var(--color-type-steel-diff); }
				&.type-water { border-color: var(--color-type-water-diff); }
			}
			
			&:hover {
				background: var(--color-hover);
			}
			
			.games-box-wrapper {
				display: flex;
				justify-content: center;
				align-items: center;
				width: auto;
				height: 50px;
				
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
		}
	}
	
	.sprites {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		
		.sprite {
			width: 100px;
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			
			img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
}
</style>
