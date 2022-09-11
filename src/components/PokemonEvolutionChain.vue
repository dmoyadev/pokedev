<script setup lang="ts">
import { ChainLink } from "@/models/Evolution";
import PokemonEvolutionStage from "@/components/PokemonEvolutionStage.vue";
import PokemonEvolutionTrigger from "@/components/PokemonEvolutionTrigger.vue";

defineProps<{
	evolution: ChainLink;
}>();
</script>

<template>
	<div class="evolution-chain">
		<PokemonEvolutionStage
			:species="evolution.species"
		/>
		
		<div
			class="next-stages"
			:class="{ 'multiple-evolutions': evolution.evolves_to.length > 1 }"
		>
			<div
				v-for="(chain, index) in evolution.evolves_to"
				:key="index"
				class="next-stage"
			>
				<PokemonEvolutionTrigger
					:chain="chain"
				/>
				<PokemonEvolutionChain
					:evolution="chain"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');

.evolution-chain {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
	gap: 10px;
}

.multiple-evolutions {
	flex-direction: column;
}

.next-stage {
	display: flex;
	gap: 10px;
	align-items: center;
}
</style>
