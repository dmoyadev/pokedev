import { ref } from "vue";
import { Pokemon } from "@/models/Pokemon";

export function useFailedImg() {
	const triedImages = ref<string[]>([]);

	/**
	 * There are some Pokémon names that does not match the Pokémon name being
	 * used by Pokémon ShowDown's sprites
	 * @param {Event} e
	 * @param {PokemonSpecies} pokemon
	 */
	function replaceWithDefaultSprite(e: Event, pokemon?: Pokemon) {
		if(!e?.target || !pokemon) {
			return;
		}

		const correctedName = `https://play.pokemonshowdown.com/sprites/ani/${pokemon?.name?.replaceAll('-', '')}.gif`;
		if(!triedImages.value.includes(correctedName)) {
			(e.target as HTMLImageElement).src = correctedName;
			triedImages.value.push(correctedName);
			return;
		}

		const defaultSprite = `https://play.pokemonshowdown.com/sprites/gen5/${pokemon?.name}.png`;
		if(!triedImages.value.includes(defaultSprite)) {
			(e.target as HTMLImageElement).src = defaultSprite;
			triedImages.value.push(defaultSprite);
		}
	}

	return {
		replaceWithDefaultSprite
	};

}
