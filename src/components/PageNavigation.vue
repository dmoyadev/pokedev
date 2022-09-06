<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	page: number
	totalPages: number
}>();

const emit = defineEmits<{
	(e: 'changePage', id: 'next' | 'prev' | number): void
}>();

const getFirstNumbers = (length: number): number[] => [...Array.from(Array(length+1).keys()).slice(-length)];
const getLastNumbers = (length: number): number[] => [...Array.from(Array(props.totalPages + 1).keys()).slice(-length)];

const shownPages = computed<number[]>(() => {
	const pages: number[] = [];
	
	// Manage small amount of pages
	if(props.totalPages <= 9) {
		return getFirstNumbers(props.totalPages);
	}
	
	// Add mandatory first two pages
	for(const oneOfFirstPages of [1, 2]) {
		if(props.totalPages >= oneOfFirstPages) {
			pages.push(oneOfFirstPages);
		}
	}
	
	// Add ... before to the previous page
	const isOneOfFirstPages = props.page < 3;
	if(!isOneOfFirstPages && !pages.includes(props.page - 2)) {
		pages.push(0);
	}
	
	// Add the previous page
	if(!pages.includes(props.page - 1)) {
		pages.push(props.page - 1);
	}
	
	// Add the current page
	if(!pages.includes(props.page)) {
		pages.push(props.page);
	}
	
	// Add the next page
	if(!pages.includes(props.page + 1)) {
		pages.push(props.page + 1);
	}
	
	// Add ... after to the next page
	const isOneOfLastPages = props.page > props.totalPages - 4;
	if(!isOneOfLastPages && !pages.includes(props.page + 2)) {
		pages.push(0);
	}
	
	// Add mandatory two last pages
	for(const oneOfLastPages of [props.totalPages - 1, props.totalPages]) {
		if(!pages.includes(oneOfLastPages)) {
			pages.push(oneOfLastPages);
		}
	}
	
	// Default layouts for specific page numbers
	if(pages.length < 9 && props.totalPages > 9) {
		// Default layout for first 3 numbers and last 3 numbers
		if(props.page < 4 || props.page > props.totalPages - 3) {
			return [...getFirstNumbers(4), 0, ...getLastNumbers(4)];
		}
		
		// Default layout for 4th page
		if(props.page === 4) {
			return [...getFirstNumbers(5), 0, ...getLastNumbers(3)];
		}
		
		// Default layout for the 4th page by the end
		if(props.page === props.totalPages - 4) {
			return [...getFirstNumbers(2), 0, ...getLastNumbers(6)];
		}
		
		// Default layout for the 4th page by the end
		if(props.page <= props.totalPages - 3) {
			return [...getFirstNumbers(3), 0, ...getLastNumbers(5)];
		}
	}
	return pages;
});

function changePage(page: 'next' | 'prev' | number) {
	emit('changePage', page);
}
</script>

<template>
	<nav>
		<RouterLink
			class="page-changer"
			:class="{ 'disabled': page <= 1 }"
			:to="{ query: page > 1 ? { page: page - 1 } : undefined }"
			@click="changePage('prev')"
		>
			‹
		</RouterLink>
		
		<ul>
			<li
				v-for="(n, index) in shownPages"
				:key="index"
				:class="{ 'active': n === (+($route?.query?.page || 1)) }"
			>
				<RouterLink
					v-if="n !== 0"
					:to="{ query: { page: n } }"
					@click="changePage(n)"
				>
					{{ n }}
				</RouterLink>
				<span v-else>...</span>
			</li>
		</ul>
		
		<RouterLink
			class="page-changer"
			:class="{ 'disabled': page >= totalPages }"
			:to="{ query: { page: page + 1 } }"
			@click="changePage('next')"
		>
			›
		</RouterLink>
	</nav>
</template>

<style scoped lang="scss">
nav {
	display: flex;
	gap: 10px;
	justify-content: space-between;
}

.page-changer {
	color: var(--color-primary);
	font-size: 28px;
	font-weight: bold;
}

a {
	min-width: 40px;
	min-height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 18px;
	text-decoration: none;
	border-radius: 5px;
	background: transparent;
	border: none;
	
	&:hover:not(.disabled) {
		cursor: pointer;
		background: var(--color-primary);
		color: var(--color-primary-text);
	}
}

.disabled {
	cursor: not-allowed;
	color: var(--color-text-light);
	pointer-events: none;
}

ul {
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	list-style: none;
	
	li {
		&.active a {
			font-weight: bold;
			color: var(--color-primary);
			border: 1px solid var(--color-primary);
			
			&:hover {
				color: var(--color-primary-text);
			}
		}
	}
}
</style>
