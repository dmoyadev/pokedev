import { ref } from "vue";
import { Pokemon } from "@/models/Pokemon";
import { useData } from "@/composables/data";

export async function usePokemon(name: string) {
	const pokemon = ref<Pokemon>();
	const isLoading = ref(false);

	isLoading.value = true;
	const { data } = await useData(`pokemon/${name}`);
	pokemon.value = data.value;
	isLoading.value = false;

	return {
		pokemon,
		isLoading
	};
}
