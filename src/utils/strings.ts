import { FlavorText, Name } from "@/models/Common";
import { Genus } from "@/models/Pokemon";

export const capitalize = (str: string) => str.replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());

export const translate = (property: Name[], lang = 'es', fallback = false) => {
	return property?.find(item => item.language.name === lang)?.name
		|| (!fallback
			? translate(property, 'en', true)
			: '');
};

export const translateFlavorText = (property: FlavorText[], lang = 'es', fallback = false) => {
	return property?.find(item => item.language.name === lang)?.flavor_text
		|| (!fallback
			? translateFlavorText(property, 'en', true)
			: '');
};

export const translateGenus = (property: Genus[], lang = 'es', fallback = false) => {
	return property?.find(item => item.language.name === lang)?.genus
		|| (!fallback
			? translateGenus(property, 'en', true)
			: '');
};
