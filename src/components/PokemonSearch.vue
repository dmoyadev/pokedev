<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { capitalize } from "@/utils/strings";
import { APIResourceWithId } from "@/models/Common";

const props = defineProps<{
	searchQuery: string;
	pokemonNamesSearched: APIResourceWithId[];
	pokemonList: APIResourceWithId[];
}>();

const emit = defineEmits<{
	(event: "update:searchQuery", ...args: any[]): void;
	(event: 'search', ...args: any[]): void;
	(event: 'clearSearch'): void;
}>();

const showSuggestions = ref(false);
const selectedSearchSuggestionIndex = ref(-1);
const searchForm = ref();
onMounted(() => {
	window.addEventListener('mousedown', e => {
		const clickedElement = e.target;
		if (!searchForm.value.contains(clickedElement)) {
			showSuggestions.value = false;
		}
	});
});
// eslint-disable-next-line @typescript-eslint/no-empty-function
onUnmounted(() => window.removeEventListener('mousedown', () => {}));

function focusPreviousSuggestion() {
	selectedSearchSuggestionIndex.value--;
	if(selectedSearchSuggestionIndex.value < -1) {
		selectedSearchSuggestionIndex.value = props.pokemonNamesSearched.length - 1;
	}
}

function focusNextSuggestion() {
	selectedSearchSuggestionIndex.value++;
	if(selectedSearchSuggestionIndex.value >= props.pokemonNamesSearched.length) {
		selectedSearchSuggestionIndex.value = -1;
	}
}

function selectSuggestion(element: HTMLElement, selection?: number) {
	if(selection === -1 || (!selection && selectedSearchSuggestionIndex.value === -1)) {
		clearSearch();
		return;
	}
	
	const search = selection
		? capitalize(props.pokemonNamesSearched[selection]?.name || '')
		: capitalize(props.pokemonNamesSearched[selectedSearchSuggestionIndex.value]?.name || '');
	if(!search) {
		return;
	}
	
	emit('update:searchQuery', search);
	
	selectedSearchSuggestionIndex.value = 0;
	showSuggestions.value = false;
	emit('search');
}

function clearSearch() {
	showSuggestions.value = false;
	selectedSearchSuggestionIndex.value = -1;
	emit('update:searchQuery', '');
	emit('clearSearch');
}
</script>

<template>
	<form
		ref="searchForm"
		@submit.prevent="$emit('search')"
		@keyup.down="focusNextSuggestion()"
		@keyup.up="focusPreviousSuggestion()"
		@keyup.enter="selectSuggestion($event.target)"
		@keyup.esc="$event.target.blur()"
		@blur="showSuggestions = false"
	>
		<input
			:value="searchQuery"
			type="text"
			placeholder="Search Pokémon"
			@click="showSuggestions = true"
			@input="$emit('update:searchQuery', $event.target.value)"
			@focus="showSuggestions = true"
		>
		<ul
			v-if="showSuggestions"
			class="search-suggestions"
		>
			<li
				:class="{ 'active': selectedSearchSuggestionIndex === -1 }"
				@click="clearSearch()"
			>
				<i>Clear the searching</i>
			</li>
			<li
				v-for="(searchSuggestion, index) in pokemonNamesSearched"
				:key="index"
				:class="{ 'active': pokemonNamesSearched[selectedSearchSuggestionIndex]?.id === searchSuggestion.id }"
				@click="selectSuggestion($event.target, index)"
			>
				#{{ String(searchSuggestion.id).padStart(3, '0') }} - {{ capitalize(searchSuggestion.name) }}
			</li>
			<li v-if="pokemonNamesSearched.length === 0">
				<i>No results found</i>
			</li>
		</ul>
	</form>
</template>

<style scoped lang="scss">
form {
	flex: 1;
	
	input {
		width: 100%;
		color: var(--color-primary-text);
		border: 1px solid var(--color-primary);
		border-radius: 5px;
		background: var(--color-background);
		height: 40px;
		padding: 5px 10px;
	}
	
	.search-suggestions {
		min-width: 50%;
		background: var(--color-background);
		border: 1px solid var(--color-primary);
		position: absolute;
		top: 100%;
		z-index: 100;
		padding: 0;
		margin: 0;
		list-style: none;
		overflow-y: auto;
		max-height: 150px;
		
		li {
			padding: 10px;
			
			&:hover,
			&.active {
				cursor: pointer;
				background: var(--color-hover);
				color: var(--color-text);
			}
		}
	}
}
</style>
