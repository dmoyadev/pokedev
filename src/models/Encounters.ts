import { Name, NamedAPIResource } from "@/models/Common";

/*
 * Methods by which the player might can encounter Pokémon in the wild,
 * e.g., walking in tall grass.
 */
export interface EncounterMethod {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** A good value for sorting */
	order: number;
	/** The name of this resource listed in different languages */
	names: Name[];
}

/*
 * Conditions which affect what Pokémon might appear in the wild, e.g.,
 * day or night.
 */
export interface EncounterCondition {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The name of this resource listed in different languages */
	names: Name[];
	/** A list of possible values for this encounter condition */
	values: NamedAPIResource[];
}

/*
 * Encounter condition values are the various states that an encounter
 * condition can have, i.e., time of day can be either day or night.
 */
export interface EncounterConditionValue {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** The condition this encounter condition value pertains to */
	condition: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
}
