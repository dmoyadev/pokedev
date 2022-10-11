<script setup lang="ts">
import { EvolutionTriggers } from "@/data/translations";
import { ChainLink, EvolutionDetail } from "@/models/Evolution";
import { computed, ref } from "vue";
import { useFetchData } from "@/composables/fetchData";
import { capitalize, translate } from "@/utils/strings";
import { Types } from "@/data/translations";
import IconMale from "@/components/icons/IconMale.vue";
import IconFemale from "@/components/icons/IconFemale.vue";
import IconType from "@/components/icons/IconType.vue";

const props = defineProps<{
	chain: ChainLink;
}>();

const evolutionTrigger = ref<EvolutionDetail>(props.chain.evolution_details[props.chain.evolution_details?.length - 1]);
const triggerName = computed(() => EvolutionTriggers[evolutionTrigger.value.trigger.name]);

// Item trigger evolution
const itemName = computed(() => evolutionTrigger.value.item?.name || evolutionTrigger.value.held_item?.name);
const itemSprite = computed(() => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName.value}.png`);
const itemImg = ref();
const itemTranslation = ref<string>();
function getItem() {
	if(evolutionTrigger.value?.item || evolutionTrigger.value?.held_item) {
		useFetchData(evolutionTrigger.value?.item?.url || evolutionTrigger.value?.held_item?.url)
			.then(({ data }) => {
				itemTranslation.value = translate(data.value.names);
			});
	}
}
getItem();

// Move trigger evolution
const moveName = computed(() => evolutionTrigger.value.known_move?.name);
const moveTranslation = ref<string>();
function getMove() {
	if(evolutionTrigger.value?.known_move) {
		useFetchData(evolutionTrigger.value?.known_move.url)
			.then(({ data }) => {
				moveTranslation.value = translate(data.value.names);
			});
	}
}
getMove();

// Party related trigger evolution
const partyMemberName = computed(() => evolutionTrigger.value.party_species?.name);
const partyMemberIcon = ref<string>();
function getPartyMember() {
	if(evolutionTrigger.value?.party_species) {
		const id = String(evolutionTrigger.value?.party_species.url.split('/').slice(-2)[0]);
		partyMemberIcon.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}
}
getPartyMember();

// Trade species trigger evolution
const tradeName = computed(() => evolutionTrigger.value.trade_species?.name);
const tradeIcon = ref<string>();
function getTrade() {
	if(evolutionTrigger.value?.trade_species) {
		const id = String(evolutionTrigger.value?.trade_species.url.split('/').slice(-2)[0]);
		tradeIcon.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
	}
}
getTrade();
</script>

<template>
	<div class="method">
		<p v-if="chain.evolution_details?.length">
			{{ triggerName }}
		</p>
		
		<!-- Stats evolution -->
		<div
			v-if="evolutionTrigger.relative_physical_stats != null"
			class="evolution-method stats-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/stats.png"
					alt=""
				>
			</div>
			<p>
				{{ evolutionTrigger.relative_physical_stats === 1
					? 'Ataque > Defensa'
					: (evolutionTrigger.relative_physical_stats === -1
						? 'Ataque < Defensa'
						: 'Ataque = Defensa') }}
			</p>
		</div>
		
		<!-- Party related evolution -->
		<div
			v-if="partyMemberName"
			class="evolution-method party-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					:src="partyMemberIcon"
					:alt="'Sprite de ' + partyMemberName"
				>
			</div>
			<p>Con {{ capitalize(partyMemberName) }} en el equipo</p>
		</div>
		
		<!-- Trade species evolution -->
		<div
			v-if="tradeName"
			class="evolution-method trade-species-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					:src="tradeIcon"
					:alt="'Sprite de ' + tradeName"
				>
			</div>
			<p>Intercambiar por un {{ capitalize(tradeName) }}</p>
		</div>
		
		<!-- Party type evolution -->
		<div
			v-if="evolutionTrigger.party_type"
			class="evolution-method party-type-evolution"
		>
			<div class="img-wrapper">
				<IconType
					class="icon"
					:pokemon-type="evolutionTrigger.party_type.name"
				/>
			</div>
			<p>Con un tipo {{ Types[evolutionTrigger.party_type.name] }} en el equipo</p>
		</div>
		
		<!-- Level evolution -->
		<div
			v-if="evolutionTrigger.min_level"
			class="evolution-method level-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/level-up.png"
					alt=""
				>
			</div>
			<p>Nivel {{ evolutionTrigger.min_level }}</p>
		</div>
		
		<!-- Gender evolution -->
		<div
			v-if="evolutionTrigger.gender"
			class="evolution-method gender-evolution"
		>
			<div class="img-wrapper">
				<IconFemale
					v-if="evolutionTrigger.gender === 1"
					class="icon female"
				/>
				<IconMale
					v-else
					class="icon male"
				/>
			</div>
			<p>Siendo {{ evolutionTrigger.gender === 1 ? 'hembra' : 'macho' }}</p>
		</div>
		
		<!-- Weather evolution -->
		<div
			v-if="evolutionTrigger.needs_overworld_rain"
			class="evolution-method weather-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/rain.png"
					alt="Icono de lluvia"
				>
			</div>
			<p>Lloviendo</p>
		</div>
		
		<!-- Item evolution -->
		<div
			v-if="itemName"
			class="evolution-method item-evolution"
		>
			<div
				ref="itemImg"
				class="img-wrapper"
			>
				<img
					class="icon"
					:src="itemSprite"
					:alt="'Sprite de ' + itemName"
					@error="itemImg.style.display = 'none'"
				>
			</div>
			<p>
				<span v-if="evolutionTrigger.trigger.name === 'level-up'">Sosteniendo</span>
				{{ itemTranslation }}
			</p>
		</div>
		
		<!-- Time of Day evolution -->
		<div
			v-if="evolutionTrigger.time_of_day"
			class="evolution-method time-of-day-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					:src="'/icons/' + evolutionTrigger.time_of_day + '.png'"
					alt=""
				>
			</div>
			<p>
				{{ evolutionTrigger.time_of_day === 'day'
					? 'Durante el día'
					: (evolutionTrigger.time_of_day === 'night'
						? 'Por la noche'
						: 'Al atardecer') }}
			</p>
		</div>
		
		<!-- Happiness evolution -->
		<div
			v-if="evolutionTrigger.min_happiness != null"
			class="evolution-method happiness-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/happiness.png"
					alt=""
				>
			</div>
			<p>Amistad +{{ evolutionTrigger.min_happiness }}</p>
		</div>
		
		<!-- Beauty evolution -->
		<div
			v-if="evolutionTrigger.min_beauty != null"
			class="evolution-method beauty-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/beauty.png"
					alt=""
				>
			</div>
			<p>Belleza +{{ evolutionTrigger.min_beauty }}</p>
		</div>
		
		<!-- Affection evolution -->
		<div
			v-if="evolutionTrigger.min_affection != null"
			class="evolution-method affection-evolution"
		>
			<div class="img-wrapper">
				<img
					class="icon"
					src="/icons/affection.png"
					alt=""
				>
			</div>
			<p>Belleza +{{ evolutionTrigger.min_affection }}</p>
		</div>
		
		<!-- Move-based evolution -->
		<div
			v-if="moveName"
			class="evolution-method move-evolution"
		>
			<p>Sabiendo {{ moveTranslation }}</p>
		</div>
		
		<!-- Turn 3DS down evolution -->
		<div
			v-if="evolutionTrigger.turn_upside_down"
			class="evolution-method turn-evolution"
		>
			<p>Darle la vuelta a la consola</p>
		</div>
		
		<div class="arrow" />
	</div>
</template>

<style scoped lang="scss">
.method {
	position: relative;
	max-width: 250px;
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.img-wrapper {
	width: 15px;
	min-width: 15px;
	height: 15px;
	min-height: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.icon {
		max-width: 100%;
		max-height: 100%;
		
		&.male {
			color: cornflowerblue;
		}
		
		&.female {
			color: hotpink;
		}
	}
}

.evolution-method {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}

.party-evolution,
.trade-species-evolution {
	.icon {
		max-width: 300%;
		max-height: 300%;
	}
}

.item-evolution {
	.icon {
		max-width: 200%;
		max-height: 200%;
	}
}

.arrow {
	margin-top: 10px;
	width: 100%;
	height: 2px;
	border-radius: 10px;
	background: var(--color-background);
	
	//Arrow right
	&:after {
		content: '';
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-top: 5px solid transparent;
		border-bottom: 5px solid transparent;
		border-left: 5px solid var(--color-background);
	}
}
</style>
