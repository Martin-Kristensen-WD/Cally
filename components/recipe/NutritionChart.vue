<template>
  <div v-if="hasData">
    <h2 class="font-display text-lg font-bold text-charcoal-800 mb-1">Næring per portion</h2>
    <p class="text-xs text-charcoal-700/50 mb-5">Fedt, kulhydrater og protein</p>

    <div class="flex items-center gap-6">
      <!-- Donut chart -->
      <div class="relative flex-shrink-0 w-[130px] h-[130px]">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Background track -->
          <circle cx="65" cy="65" r="50" fill="none" stroke="#f5e6cc" stroke-width="18" />
          <!-- Protein (blue) -->
          <circle
            cx="65" cy="65" r="50"
            fill="none"
            stroke="#3B82F6"
            stroke-width="18"
            stroke-linecap="butt"
            :stroke-dasharray="`${proteinLen} ${circ}`"
            :stroke-dashoffset="0"
            transform="rotate(-90 65 65)"
          />
          <!-- Carbs (pink) -->
          <circle
            cx="65" cy="65" r="50"
            fill="none"
            stroke="#EC4899"
            stroke-width="18"
            stroke-linecap="butt"
            :stroke-dasharray="`${carbsLen} ${circ}`"
            :stroke-dashoffset="`${-proteinLen}`"
            transform="rotate(-90 65 65)"
          />
          <!-- Fat (amber) -->
          <circle
            cx="65" cy="65" r="50"
            fill="none"
            stroke="#F59E0B"
            stroke-width="18"
            stroke-linecap="butt"
            :stroke-dasharray="`${fatLen} ${circ}`"
            :stroke-dashoffset="`${-(proteinLen + carbsLen)}`"
            transform="rotate(-90 65 65)"
          />
        </svg>
        <!-- Center: calories -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-xl font-bold text-charcoal-800 leading-none">{{ calories }}</span>
          <span class="text-[10px] font-semibold text-charcoal-700/50 tracking-wider mt-0.5">KCAL</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="space-y-3 flex-1">
        <div class="flex items-start gap-2">
          <span class="mt-1 w-3 h-3 rounded-sm flex-shrink-0 bg-blue-500" />
          <div>
            <p class="text-xs font-semibold text-charcoal-800">Protein</p>
            <p class="text-xs text-charcoal-700/60">{{ protein }}g / {{ proteinPct }}%</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="mt-1 w-3 h-3 rounded-sm flex-shrink-0 bg-pink-500" />
          <div>
            <p class="text-xs font-semibold text-charcoal-800">Kulhydrater</p>
            <p class="text-xs text-charcoal-700/60">{{ carbs }}g / {{ carbsPct }}%</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <span class="mt-1 w-3 h-3 rounded-sm flex-shrink-0 bg-amber-400" />
          <div>
            <p class="text-xs font-semibold text-charcoal-800">Fedt</p>
            <p class="text-xs text-charcoal-700/60">{{ fat }}g / {{ fatPct }}%</p>
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
const totalKcal = computed(() => {
  return (props.protein ?? 0) * 4 + (props.carbs ?? 0) * 4 + (props.fat ?? 0) * 9
})

const pct = (kcal: number) =>
  totalKcal.value > 0 ? Math.round((kcal / totalKcal.value) * 100) : 0

const proteinPct = computed(() => pct((props.protein ?? 0) * 4))
const carbsPct = computed(() => pct((props.carbs ?? 0) * 4))
const fatPct = computed(() => pct((props.fat ?? 0) * 9))

// SVG donut segments
const r = 50
const circ = 2 * Math.PI * r
const proteinLen = computed(() => (proteinPct.value / 100) * circ)
const carbsLen = computed(() => (carbsPct.value / 100) * circ)
const fatLen = computed(() => (fatPct.value / 100) * circ)
</script>
