import { FlavorText, Name } from "@/models/Common";

export const capitalize = (str: string) => str.replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());

export const translate = (property: Name[], lang = 'es', fallback = false) => {
	return property?.find(item => item.language.name === lang)?.name
		|| (!fallback
			? translate(property, 'en', true)
			: '');
};
export const translateFlavorText = (property: FlavorText[], lang = 'es') => property ? property.find(item => item.language.name === lang)?.flavor_text : '';
