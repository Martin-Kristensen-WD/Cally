<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid sm:grid-cols-2 gap-6">
      <!-- Titel -->
      <div class="sm:col-span-2">
        <label class="form-label">Titel *</label>
        <input v-model="form.title" type="text" class="form-input" placeholder="f.eks. Klassisk Avocado Toast" required />
      </div>

      <!-- Beskrivelse -->
      <div class="sm:col-span-2">
        <label class="form-label">Beskrivelse</label>
        <textarea
          v-model="form.description"
          class="form-input resize-none"
          rows="3"
          placeholder="En kort beskrivelse af opskriften..."
        />
      </div>

      <!-- Kategorier -->
      <div class="sm:col-span-2">
        <label class="form-label">Kategorier *</label>
        <div class="flex flex-wrap gap-2 mt-1">
          <button
            v-for="cat in CATEGORIES"
            :key="cat"
            type="button"
            class="px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors duration-150"
            :class="form.categories.includes(cat)
              ? 'bg-spice-500 text-white border-spice-500'
              : 'border-spice-400 text-spice-500 hover:bg-spice-50'"
            @click="toggleCategory(cat)"
          >
            {{ CATEGORY_LABELS[cat] ?? cat }}
          </button>
        </div>
        <p v-if="form.categories.length === 0" class="text-xs text-red-400 mt-1">Vælg mindst én kategori</p>
      </div>

      <!-- Kalorier -->
      <div>
        <label class="form-label">Estimerede kalorier (kcal)</label>
        <input
          v-model.number="form.estimated_calories"
          type="number"
          class="form-input"
          placeholder="f.eks. 450"
          min="0"
        />
      </div>

      <!-- Makronæringsstoffer -->
      <div class="sm:col-span-2">
        <label class="form-label">Makronæringsstoffer (g per portion)</label>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-semibold text-blue-500 mb-1 block">Protein (g)</label>
            <input
              v-model.number="form.protein"
              type="number"
              class="form-input"
              placeholder="f.eks. 12"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-pink-500 mb-1 block">Kulhydrater (g)</label>
            <input
              v-model.number="form.carbs"
              type="number"
              class="form-input"
              placeholder="f.eks. 54"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-amber-500 mb-1 block">Fedt (g)</label>
            <input
              v-model.number="form.fat"
              type="number"
              class="form-input"
              placeholder="f.eks. 24"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Billede -->
    <div>
      <label class="form-label">Opskriftsbillede</label>
      <div class="flex items-center gap-4">
        <div v-if="imagePreview || form.image_url" class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
          <img :src="imagePreview || form.image_url || ''" alt="Forhåndsvisning" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1">
          <input
            type="file"
            accept="image/*"
            class="block w-full text-sm text-charcoal-700/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spice-50 file:text-spice-600 hover:file:bg-spice-100 cursor-pointer"
            @change="handleImageSelect"
          />
          <p class="text-xs text-charcoal-700/40 mt-1">JPG, PNG, WebP. Uploades direkte til lagring.</p>
        </div>
      </div>
    </div>

    <!-- Ingredienser -->
    <div>
      <label class="form-label">Ingredienser</label>
      <IngredientList v-model="form.ingredients" />
    </div>

    <!-- Fremgangsmåde -->
    <div>
      <label class="form-label">Fremgangsmåde</label>
      <div class="space-y-2">
        <div
          v-for="(step, index) in form.directions"
          :key="index"
          class="flex gap-2 items-start"
        >
          <span class="flex-shrink-0 w-7 h-7 rounded-full bg-spice-500 text-white text-xs font-bold flex items-center justify-center mt-3">
            {{ index + 1 }}
          </span>
          <textarea
            v-model="form.directions[index]"
            class="form-input resize-none flex-1"
            rows="2"
            :placeholder="`Trin ${index + 1}...`"
          />
          <button
            type="button"
            class="text-charcoal-700/40 hover:text-red-500 transition-colors flex-shrink-0 p-1 mt-3"
            @click="removeStep(index)"
          >
            ✕
          </button>
        </div>
        <button type="button" class="btn-ghost text-sm" @click="addStep">
          + Tilføj trin
        </button>
      </div>
    </div>

    <!-- Handlinger -->
    <div class="flex items-center gap-3 pt-2">
      <button type="submit" class="btn-primary" :disabled="saving">
        <span v-if="saving">Gemmer…</span>
        <span v-else>{{ isEdit ? 'Gem ændringer' : 'Opret opskrift' }}</span>
      </button>
      <NuxtLink to="/admin" class="btn-ghost">Annuller</NuxtLink>
    </div>

    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import type { Recipe, RecipeInsert } from '~/types/recipe'
import { CATEGORIES, CATEGORY_LABELS } from '~/types/recipe'

const props = defineProps<{
  recipe?: Recipe
}>()

const emit = defineEmits<{
  submit: [data: RecipeInsert, imageFile: File | null]
}>()

const { categories } = useCategories()
const saving = ref(false)
const error = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const form = reactive<RecipeInsert>({
  title: props.recipe?.title ?? '',
  description: props.recipe?.description ?? '',
  categories: props.recipe?.categories ?? [],
  ingredients: props.recipe?.ingredients ?? [{ amount: '', unit: '', item: '' }],
  directions: props.recipe?.directions ?? [''],
  estimated_calories: props.recipe?.estimated_calories ?? null,
  protein: props.recipe?.protein ?? null,
  carbs: props.recipe?.carbs ?? null,
  fat: props.recipe?.fat ?? null,
  image_url: props.recipe?.image_url ?? null,
})

const toggleCategory = (cat: string) => {
  const idx = form.categories.indexOf(cat)
  if (idx === -1) form.categories.push(cat)
  else form.categories.splice(idx, 1)
}

const isEdit = computed(() => !!props.recipe)

const handleImageSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const addStep = () => form.directions.push('')
const removeStep = (index: number) => form.directions.splice(index, 1)

const handleSubmit = async () => {
  if (form.categories.length === 0) {
    error.value = 'Vælg mindst én kategori.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const cleanedForm: RecipeInsert = {
      ...form,
      ingredients: form.ingredients.filter(i => i.item.trim()),
      directions: form.directions.filter(d => d.trim()),
    }
    emit('submit', cleanedForm, imageFile.value)
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Noget gik galt.'
    saving.value = false
  }
}

defineExpose({ setSaving: (val: boolean) => { saving.value = val }, setError: (msg: string) => { error.value = msg } })
</script>
