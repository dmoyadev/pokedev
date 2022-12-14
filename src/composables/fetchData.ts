import { getFromDB, PokedevTables, saveToDB } from "@/utils/idb";
import { ref } from "vue";

export interface API_RESPONSE {
	count: number;
	next: string | null;
	previous: string | null;
	results: any[];
}

export async function useFetchData(endpoint: string){
	const isLoading = ref(true);
	const error = ref();
	const data = ref();

	const URL = endpoint.includes('https') ? endpoint : `${import.meta.env.VITE_API_URL + endpoint}`;
	data.value = await getFromDB(URL, PokedevTables.API_CALLS);
	if(!data.value) {
		const response: API_RESPONSE = await fetch(URL).then(res => res.json());
		data.value = response;
		await saveToDB({ url: URL, data: response }, PokedevTables.API_CALLS);
	}
	isLoading.value = false;

	return {
		isLoading,
		error,
		data
	};
}
