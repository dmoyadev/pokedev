import { ref } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useFetchData } from "@/composables/fetchData";

export async function useFetchPokemon(name: string) {
	const pokemon = ref<Pokemon>();
	const isLoading = ref(false);

	isLoading.value = true;
	const { data } = await useFetchData(`pokemon/${name}`);
	pokemon.value = data.value;
	isLoading.value = false;

	return {
		pokemon,
		isLoading
	};
}
