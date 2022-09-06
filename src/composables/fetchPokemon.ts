import { ref } from "vue";
import { PokemonWithSpecie } from "@/models/Pokemon";
import { useFetchData } from "@/composables/fetchData";

export async function useFetchPokemon(name: string, details = false) {
	const pokemon = ref<PokemonWithSpecie>();
	const isLoading = ref(false);

	isLoading.value = true;
	const { data } = await useFetchData(`pokemon/${name}`);
	pokemon.value = data.value;
	if(details && data.value) {
		const { data: specie } = await useFetchData(`pokemon-species/${data.value.species.name}`);
		pokemon.value = {
			...specie.value,
			...pokemon.value,
		};
	}
	isLoading.value = false;

	return {
		pokemon,
		isLoading
	};
}
