<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { capitalize } from "@/utils/strings";
import { APIResourceWithId } from "@/models/Common";
import IconClear from "@/components/icons/IconClear.vue";

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
		if (!searchForm.value?.contains(clickedElement)) {
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

function selectSuggestion(selection?: number) {
	const search = selection
		? capitalize(props.pokemonNamesSearched[selection]?.name || '')
		: capitalize(props.pokemonNamesSearched[selectedSearchSuggestionIndex.value]?.name || '');
	
	emit('update:searchQuery', search || props.searchQuery);
	
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
		@keyup.enter="selectSuggestion()"
		@keyup.esc="showSuggestions = false"
		@blur="showSuggestions = false"
	>
		<input
			:value="searchQuery"
			type="text"
			placeholder="Search Pokémon by name or number"
			@click="showSuggestions = true"
			@input="$emit('update:searchQuery', $event?.target && $event.target['value'])"
			@focus="showSuggestions = true"
		>
		<button
			v-if="searchQuery"
			type="reset"
			@click="clearSearch()"
		>
			<IconClear class="icon" />
		</button>
		<ul
			v-if="showSuggestions"
			class="search-suggestions"
		>
			<li
				v-if="searchQuery"
				:class="{ 'active': selectedSearchSuggestionIndex === -1 }"
				@mouseover="selectedSearchSuggestionIndex = -1"
				@click="selectSuggestion()"
			>
				<i>{{ searchQuery }}</i>
			</li>
			<li
				v-for="(searchSuggestion, index) in pokemonNamesSearched"
				:key="index"
				:class="{ 'active': pokemonNamesSearched[selectedSearchSuggestionIndex]?.id === searchSuggestion.id }"
				@mouseover="selectedSearchSuggestionIndex = index"
				@click="selectSuggestion(index)"
			>
				#{{ String(searchSuggestion.id).padStart(3, '0') }} - {{ capitalize(searchSuggestion.name) }}
			</li>
			<li
				v-if="pokemonNamesSearched.length === 0"
				class="empty-list"
			>
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
	
	button {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		color: var(--color-primary-text);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		
		.icon {
			width: 15px;
			height: 15px;
		}
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
			
			&.active {
				cursor: pointer;
				background: var(--color-hover);
				color: var(--color-text);
			}
		}
	}
}
</style>
