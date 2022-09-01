import { Name, NamedAPIResource } from "@/models/Common";

/*
 * Berries are small fruits that can provide HP and status condition
 * restoration, stat enhancement, and even damage negation when eaten by Pokémon.
 */
export interface Berry {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** Time it takes the tree to grow one stage, in hours. Berry trees go through four of these growth stages before they can be picked */
	growth_time: string;
	/** The maximum number of these berries that can grow on one tree in Generation IV */
	max_harvest: number;
	/** The power of the move "Natural Gift" when used with this Berry */
	natural_gift_power: number;
	/** The size of this Berry, in millimeters */
	size: number;
	/** The smoothness of this Berry, used in making Pokéblocks or Poffins */
	smoothness: number;
	/** The speed at which this Berry dries out the soil as it grows. A higher rate means the soil dries more quickly */
	soil_dryness: number;
	/** The firmness of this berry, used in making Pokéblocks or Poffins */
	firmness: NamedAPIResource;
	/** A list of references to each flavor a berry can have and the potency of each of those flavors in regard to this berry */
	flavors: BerryFlavorMap[];
	/** Berries are actually items. This is a reference to the item specific data for this berry */
	item: NamedAPIResource;
	/** The type inherited by "Natural Gift" when used with this Berry */
	natural_gift_type: NamedAPIResource;
}

/*
 * Flavors determine whether a Pokémon will benefit or suffer from eating a
 * berry based on their nature.
 */
export interface BerryFlavor {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** A list of the berries with this flavor */
	berries: FlavorBerryMap[];
	/** The contest type that correlates with this berry flavor */
	contest_type: NamedAPIResource;
	/** The name of this resource listed in different languages */
	names: Name[];
}

/*
 * Berries can be soft, very soft, hard, super hard or very hard.
 */
export interface BerryFirmness {
	/** The identifier for this resource */
	id: number;
	/** The name for this resource */
	name: string;
	/** A list of the berries with this firmness */
	berries: NamedAPIResource[];
	/** The name of this resource listed in different languages */
	names: Name[];
}

/*
 * Reference to the flavor a berry can have and the potency of each of those
 * flavors in regard to this berry.
 */
export interface BerryFlavorMap {
	/** How powerful the referenced flavor is for this berry */
	potency: number;
	/** The referenced berry flavor */
	flavor: NamedAPIResource;
}

/*
 * Berry with the given flavor.
 */
export interface FlavorBerryMap {
	/**How powerful the referenced flavor is for this berry */
	potency: number;
	/** The berry with the referenced flavor*/
	berry: NamedAPIResource;
}
