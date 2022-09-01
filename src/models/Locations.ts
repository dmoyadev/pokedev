import { GenerationGameIndex, Name, NamedAPIResource, VersionEncounterDetail } from "@/models/Common";

/*
 * Locations that can be visited within the games. Locations make up sizable portions of regions, like cities or routes.
 */
export interface Location {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The region this location can be found in */
	region: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** A list of game indices relevant to this location by generation */
	game_indices: GenerationGameIndex[];
	/** Areas that can be found within this location */
	areas: NamedAPIResource[];
}

/*
 * Location areas are sections of areas, such as floors in a building or cave. Each area has its own set of possible Pokémon encounters.
 */
export interface LocationArea {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The internal id of an API resource within game data */
	game_index: number;
	/** A list of methods in which Pokémon may be encountered in this area and how likely the method will occur depending on the version of the game */
	encounter_method_rates: EncounterMethodRate;
	/** The region this location area can be found in */
	location: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** A list of Pokémon that can be encountered in this area along with version specific details about the encounter */
	pokemon_encounters: PokemonEncounter[];
}

/*
 * Areas used for grouping Pokémon encounters in Pal Park. They're like habitats that are specific to Pal Park. Pal Park is divided into five separate areas:
 *
 * Field - The field is directly in front of the entrance to the catching area.
 * Forest - The forest is a path along the northwest corner of the catching area that leads to the field in the south and mountain in the east.
 * Mountain - The mountain is located in the north of the catching area.
 * Pond - The pond is located in the northeast corner of the catching area. Surf is required to obtain the Pokémon within it.
 * Sea - The sea is located in the southeast corner of the catching area. Surf is required to obtain the Pokémon within it.
 * Trivia - Pokémon introduced in Generation IV have Pal Park locations and score values programmed in, even though they cannot be migrated from Generation III.
 */
export interface PalParkArea {
	/**The identifier for this resource */
	id: number;
	/** The name for this resource*/
	name: string;
	/**The name of this resource listed in different languages */
	names: Name[];
	/** A list of Pokémon encountered in thi pal park area along with details*/
	pokemon_encounters: PalParkEncounterSpecies[];
}

/*
 * Details of a Pokémon encountered in the Pal Park area.
 */
export interface PalParkEncounterSpecies {
	/** The base score given to the player when this Pokémon is caught during a pal park run */
	base_score: number;
	/** The base rate for encountering this Pokémon in this pal park area */
	rate: number;
	/** The Pokémon species being encountered */
	pokemon_species: NamedAPIResource;
}

/*
 * A region is an organized area of the Pokémon world. Most often, the main difference between regions is the species of Pokémon that can be encountered within them.
 */
export interface Region {
	/** The identifier for this resource */
	id: number;
	/** A list of locations that can be found in this region */
	locations: NamedAPIResource[];
	/** The name for this resource */
	name: string;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** The generation this region was introduced in */
	main_generation: NamedAPIResource;
	/** A list of Pokédex that catalogue Pokémon in this region */
	pokedexes: NamedAPIResource[];
	/** A list of version groups where this region can be visited */
	version_groups: NamedAPIResource[];
}

/*
 * Method in which Pokémon may be encountered in the given area and how likely the method will occur depending on the version of the game.
 */
export interface EncounterMethodRate {
	/** The method in which Pokémon may be encountered in an area */
	encounter_method: NamedAPIResource;
	/** The chance of the encounter to occur on a version of the game */
	version_details: EncounterVersionDetails[];
}

/*
 * The chance of the encounter to occur on a version of the game.
 */
export interface EncounterVersionDetails {
	/** The chance of an encounter to occur */
	rate: number;
	/** The version of the game in which the encounter can occur with the given chance */
	version: NamedAPIResource;
}

/*
 * Describes a pokémon encounter in a given area.
 */
export interface PokemonEncounter {
	/** The Pokémon being encountered */
	pokemon: NamedAPIResource;
	/** A list of versions and encounters with Pokémon that might happen in the referenced location area */
	version_details: VersionEncounterDetail[];
}
