<script setup lang="ts">
import { useFetchData } from "@/composables/fetchData";
import { computed, ref, watch } from "vue";
import { capitalize, translate } from "@/utils/strings";
import { PokemonStatWithData, PokemonWithSpecie } from "@/models/Pokemon";
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{
	pokemon: PokemonWithSpecie;
}>();

// Stats chart data
const statsData = ref<PokemonStatWithData[]>([]);

function getStatsData() {
	props.pokemon?.stats.forEach(({ stat }) => {
		useFetchData(stat.url)
			.then(({ data }) => {
				const pokemonStat = props.pokemon?.stats.find(({ stat: { name } }) => name === data.value.name);
				statsData.value.push({
					...data.value ,
					...pokemonStat
				});
			});
	});
}

const COLOR_TO_HEX = {
	bug: "#92BC2C",
	dark: "#595761",
	dragon: "#0C69C8",
	electric: "#F2D94E",
	fire: "#FBA54C",
	fairy: "#EE90E6",
	fighting: "#D3425F",
	flying: "#A1BBEC",
	ghost: "#5F6DBC",
	grass: "#5FBD58",
	ground: "#DA7C4D",
	ice: "#75D0C1",
	normal: "#A0A29F",
	poison: "#B763CF",
	psychic: "#FA8581",
	rock: "#C9BB8A",
	steel: "#5695A3",
	water: "#539DDF",
};
const chartOptions = computed(() => {
	return {
		chart: {
			type: 'radar',
			toolbar: {
				show: false
			},
		},
		theme: {
			monochrome: {
				enabled: true,
				color: COLOR_TO_HEX[props.pokemon?.types[0].type.name || 'normal']
			},
		},
		tooltip: {
			enabled: false,
		},
		xaxis: {
			categories: statsData.value.map(({ names }) => capitalize(translate(names))),
			max: 200,
		},
		yaxis: {
			show: false,
		},
		fill: {
			opacity: 0.5,
			colors: [COLOR_TO_HEX[props.pokemon?.types[0].type.name || 'normal']]
		},
		dataLabels: {
			enabled: true,
			background: {
				enabled: true,
				borderRadius: 2,
			}
		}
	};
});
const chartSeries = computed(() => {
	return [{
		name: "Valor",
		data: props.pokemon?.stats.map(stat => stat.base_stat)
	}];
});

// Init
watch(() => props.pokemon, (value) => {
	if(value) {
		getStatsData();
	}
});
</script>

<template>
	<VueApexCharts
		v-if="statsData.length"
		height="300"
		width="300"
		type="radar"
		:options="chartOptions"
		:series="chartSeries"
	/>
</template>
