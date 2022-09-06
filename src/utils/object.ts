export function flattenObject(ob: any) {
	const toReturn = {};

	for (const i in ob) {
		if (!ob[i]) continue;

		if ((typeof ob[i]) == 'object' && ob[i] !== null) {
			const flatObject = flattenObject(ob[i] as any);
			for (const x in flatObject) {
				if (!flatObject[x]) continue;

				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}
