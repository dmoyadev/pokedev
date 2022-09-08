import { Ref, ref } from "vue";
import { Generation } from "@/models/Game";
import { NamedAPIResourceList } from "@/models/Common";
import { useFetchData } from "@/composables/fetchData";

export function useFetchGenerations() {
	const generations = ref<Generation[]>([]);

	useFetchData(`generation`)
		.then(({ data }: { data: Ref<NamedAPIResourceList> }) => {
			data.value.results.forEach(({ url }) => {
				useFetchData(url)
					.then((result) => {
						const { data } = result;
						if(data.value) {
							generations.value.push(data.value);
						}
					});
			});
		});

	return {
		generations,
	};
}
