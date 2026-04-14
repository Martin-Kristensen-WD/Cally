<template>
  <NuxtLink ref="cardRef" :to="`/recipes/${recipe.id}`" class="recipe-card block group">
    <!-- Image -->
    <div class="relative aspect-[4/3] sm:aspect-[5/4] bg-cream-100 overflow-hidden">
      <img
        v-if="recipe.image_url"
        :src="recipe.image_url"
        :alt="recipe.title"
        class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)"
      >
        <span class="font-display font-semibold leading-none select-none text-[5rem] text-charcoal-800/[0.08]">{{ recipe.title.charAt(0) }}</span>
      </div>

      <!-- Meal type tags — frosted glass overlay at bottom -->
      <div v-if="recipe.meal_types?.length" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent pt-12 pb-3 px-3">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="type in recipe.meal_types"
            :key="type"
            class="bg-white/25 backdrop-blur-md text-white text-[12px] sm:text-[10px] font-body font-semibold px-3 py-1 rounded-full border border-white/30 tracking-wide"
          >
            {{ MEAL_TYPE_LABELS[type] ?? type }}
          </span>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="px-4 py-4">
      <h3 class="font-display font-semibold text-[21px] sm:text-[17px] text-charcoal-800 leading-[1.25] mb-1 line-clamp-2 tracking-tight">
        {{ recipe.title }}
      </h3>
      <div class="flex items-center justify-between mt-2 gap-2">
        <p v-if="recipe.description" class="text-[13px] text-charcoal-700/50 font-body line-clamp-1 flex-1">
          {{ recipe.description }}
        </p>
        <span v-if="recipe.estimated_calories" class="flex-shrink-0 text-[13px] sm:text-[11px] font-body font-semibold tracking-wide" :class="calorieColor(recipe.estimated_calories)">
          {{ recipe.estimated_calories }} kcal
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import { MEAL_TYPE_LABELS } from '~/types/recipe'

const props = defineProps<{
  recipe: Recipe
  index?: number
}>()

const cardRef = ref<{ $el: HTMLElement } | null>(null)

onMounted(() => {
  const el = cardRef.value?.$el
  if (!el) return
  const delay = ((props.index ?? 0) % 4) * 70
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.style.animationDelay = `${delay}ms`
        el.classList.add('card-entering')
        el.addEventListener('animationend', () => {
          el.classList.remove('card-entering')
          el.classList.add('card-visible')
          el.style.animationDelay = ''
        }, { once: true })
        observer.unobserve(el)
      }
    },
    { threshold: 0.06 },
  )
  observer.observe(el)
})

const calorieColor = (kcal: number) => {
  if (kcal < 300) return 'text-sunlit'
  if (kcal < 500) return 'text-amber'
  return 'text-terracotta'
}
</script>
