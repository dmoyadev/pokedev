import { ref } from "vue";
import { Pokemon, PokemonSpecies } from "@/models/Pokemon";
import { useData } from "@/composables/data";

export async function usePokemon(name: string, withDetail = true) {
	const pokemon = ref<Pokemon | PokemonSpecies>();
	const isLoading = ref(false);

	isLoading.value = true;
	const { data } = await useData(`${withDetail ? 'pokemon' : 'pokemon-species'}/${name}`);
	pokemon.value = data.value;
	isLoading.value = false;

	return {
		pokemon,
		isLoading
	};
}
