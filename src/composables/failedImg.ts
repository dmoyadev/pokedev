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

		//Get all strings after a dash
		const gigaMax = pokemon.name.split("-")[1] || pokemon.name;
		if(gigaMax === 'gmax') {
			const gigaMaxName = `https://play.pokemonshowdown.com/sprites/gen5/${pokemon.name}.png`;
			if(!triedImages.value.includes(gigaMaxName)) {
				(e.target as HTMLImageElement).src = gigaMaxName;
				triedImages.value.push(gigaMaxName);
				return;
			}
		}

		const correctedName = `https://play.pokemonshowdown.com/sprites/ani/${pokemon?.species?.name?.replaceAll('-', '')}.gif`;
		if(!triedImages.value.includes(correctedName)) {
			(e.target as HTMLImageElement).src = correctedName;
			triedImages.value.push(correctedName);
			return;
		}

		const defaultSprite = `https://play.pokemonshowdown.com/sprites/gen5/${pokemon?.species?.name}.png`;
		if(!triedImages.value.includes(defaultSprite)) {
			(e.target as HTMLImageElement).src = defaultSprite;
			triedImages.value.push(defaultSprite);
			return;
		}

		(e.target as HTMLImageElement).parentNode?.removeChild(e.target as HTMLImageElement);
	}

	function replaceUsingName(e: Event, pokemonName: string) {
		const correctedName = `https://play.pokemonshowdown.com/sprites/ani/${pokemonName.replaceAll('-', '')}.gif`;
		if(!triedImages.value.includes(correctedName)) {
			(e.target as HTMLImageElement).src = correctedName;
			triedImages.value.push(correctedName);
			return;
		}

		(e.target as HTMLImageElement).parentNode?.removeChild(e.target as HTMLImageElement);
	}

	function clearTriesList() {
		triedImages.value = [];
	}

	return {
		clearTriesList,
		replaceWithDefaultSprite,
		replaceUsingName
	};

}
