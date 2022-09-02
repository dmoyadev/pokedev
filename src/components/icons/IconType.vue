<script setup lang="ts">
defineProps<{
	pokemonType: string,
}>();
</script>

<template>
	<div :class="'type-'+pokemonType">
		<img
			:src="`icons/types/${pokemonType}.svg`"
			alt=""
		>
	</div>
</template>

<style scoped lang="scss">
div {
	border-radius: 100%;
	
	img {
		height: 60%;
		width: 60%;
		margin: 20%;
		
	}
}
</style>
