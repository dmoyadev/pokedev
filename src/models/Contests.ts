import { Effect, FlavorText, NamedAPIResource } from "@/models/Common";

/*
 * Contest types are categories judges used to weigh a Pokémon's condition in Pokémon contests.
 */
export interface ContestType {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The berry flavor that correlates with this contest type */
	berry_flavor: NamedAPIResource;
	/** The name of this contest type listed in different languages */
	names: ContestName[];
}

/*
 * Contest effects refer to the effects of moves when used in contests.
 */
export interface ContestEffect {
	/** The identifier for this resource */
	id: number;
	/** The base number of hearts the user of this move gets */
	appeal: number;
	/** The base number of hearts the user's opponent loses */
	jam: number;
	/** The result of this contest effect listed in different languages */
	effect_entries: Effect[];
	/** The flavor text of this contest effect listed in different languages */
	flavor_text_entries: FlavorText[];
}

/*
 * Super contest effects refer to the effects of moves when used in super
 * contests. A Pokémon Super Contest is an expanded format of the Pokémon
 * Contests for the Generation IV games, specifically in Diamond, Pearl,
 * and Platinum. In it, Pokémon are rated on their appearance and performance,
 * rather than strength.
 */
export interface SuperContestEffect {
	/** The identifier for this resource */
	id: number;
	/** The level of appeal this super contest effect has */
	appeal: number;
	/** The flavor text of this super contest effect listed in different languages */
	flavor_text_entries: FlavorText[];
	/** A list of moves that have the effect when used in super contests */
	moves: NamedAPIResource[];
}

/*
 * The name of the given contest type.
 */
export interface ContestName {
	/** The name for this contest */
	name: string;
	/** The color associated with this contest's name */
	color: string;
	/** The language that this name is in */
	language: NamedAPIResource;
}
