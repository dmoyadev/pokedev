<script setup lang="ts">
import { useData } from "@/composables/data";
import { ref } from "vue";

const data = ref();
useData('pokemon')
	.then((response) => {
		data.value = response.data.value;
	});
</script>

<template>
	<h1>¡Hola!</h1>
	<ul>
		<li
			v-for="(element, index) in data"
			:key="index"
		>
			{{ element }}
		</li>
	</ul>
</template>

<style scoped lang="scss">

</style>
