<template>
  <div v-if="hasData">
    <h2 class="font-display text-[18px] font-semibold text-charcoal-800 tracking-tight mb-0.5">Næring per portion</h2>
    <p class="text-[12px] font-body text-charcoal-700/40 mb-6">Protein, kulhydrater og fedt</p>

    <div class="flex items-center gap-7">
      <!-- Donut chart -->
      <div class="relative flex-shrink-0 w-[120px] h-[120px]">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <!-- Background track -->
          <circle cx="60" cy="60" r="46" fill="none" stroke="#EAE2D4" stroke-width="13" />
          <!-- Protein (espresso) -->
          <circle
            cx="60" cy="60" r="46"
            fill="none"
            stroke="#5C3D2E"
            stroke-width="13"
            stroke-linecap="butt"
            :stroke-dasharray="`${proteinLen - gap} ${circ - (proteinLen - gap)}`"
            :stroke-dashoffset="0"
            transform="rotate(-90 60 60)"
          />
          <!-- Carbs (cinnamon) -->
          <circle
            cx="60" cy="60" r="46"
            fill="none"
            stroke="#A8724A"
            stroke-width="13"
            stroke-linecap="butt"
            :stroke-dasharray="`${carbsLen - gap} ${circ - (carbsLen - gap)}`"
            :stroke-dashoffset="`${-(proteinLen)}`"
            transform="rotate(-90 60 60)"
          />
          <!-- Fat (sand) -->
          <circle
            cx="60" cy="60" r="46"
            fill="none"
            stroke="#C9B99A"
            stroke-width="13"
            stroke-linecap="butt"
            :stroke-dasharray="`${fatLen - gap} ${circ - (fatLen - gap)}`"
            :stroke-dashoffset="`${-(proteinLen + carbsLen)}`"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <!-- Center: calories -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="font-display text-[20px] font-semibold text-charcoal-800 leading-none tracking-tight">{{ calories ?? totalKcalRounded }}</span>
          <span class="text-[9px] font-body font-semibold text-charcoal-700/40 tracking-[0.08em] uppercase mt-1">kcal</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex-1 space-y-3.5">
        <!-- Protein -->
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: #5C3D2E" />
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-1 mb-1">
              <span class="text-[13px] font-body font-medium text-charcoal-800">Protein</span>
              <span class="text-[12px] font-body text-charcoal-700/50 tabular-nums">{{ protein }}g <span class="text-charcoal-700/30">·</span> {{ proteinPct }}%</span>
            </div>
            <div class="h-1 rounded-full bg-cream-200 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${proteinPct}%`, backgroundColor: '#5C3D2E' }" />
            </div>
          </div>
        </div>

        <!-- Carbs -->
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: #A8724A" />
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-1 mb-1">
              <span class="text-[13px] font-body font-medium text-charcoal-800">Kulhydrater</span>
              <span class="text-[12px] font-body text-charcoal-700/50 tabular-nums">{{ carbs }}g <span class="text-charcoal-700/30">·</span> {{ carbsPct }}%</span>
            </div>
            <div class="h-1 rounded-full bg-cream-200 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${carbsPct}%`, backgroundColor: '#A8724A' }" />
            </div>
          </div>
        </div>

        <!-- Fat -->
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: #C9B99A" />
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-1 mb-1">
              <span class="text-[13px] font-body font-medium text-charcoal-800">Fedt</span>
              <span class="text-[12px] font-body text-charcoal-700/50 tabular-nums">{{ fat }}g <span class="text-charcoal-700/30">·</span> {{ fatPct }}%</span>
            </div>
            <div class="h-1 rounded-full bg-cream-200 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" :style="{ width: `${fatPct}%`, backgroundColor: '#C9B99A' }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
}>()

const hasData = computed(() =>
  props.protein != null || props.carbs != null || props.fat != null
)

// Caloric contribution: protein/carbs = 4 kcal/g, fat = 9 kcal/g
const totalKcal = computed(() =>
  (props.protein ?? 0) * 4 + (props.carbs ?? 0) * 4 + (props.fat ?? 0) * 9
)

const totalKcalRounded = computed(() => Math.round(totalKcal.value))

const pct = (kcal: number) =>
  totalKcal.value > 0 ? Math.round((kcal / totalKcal.value) * 100) : 0

const proteinPct = computed(() => pct((props.protein ?? 0) * 4))
const carbsPct = computed(() => pct((props.carbs ?? 0) * 4))
const fatPct = computed(() => pct((props.fat ?? 0) * 9))

// SVG donut — small gap between segments
const r = 46
const circ = 2 * Math.PI * r
const gap = 3
const proteinLen = computed(() => (proteinPct.value / 100) * circ)
const carbsLen = computed(() => (carbsPct.value / 100) * circ)
const fatLen = computed(() => (fatPct.value / 100) * circ)
</script>
