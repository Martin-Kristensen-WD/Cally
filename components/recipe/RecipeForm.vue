<template>
  <form class="space-y-8" @submit.prevent="handleSubmit">

    <!-- Title + Description -->
    <div class="space-y-5">
      <div>
        <label class="form-label">Titel *</label>
        <input v-model="form.title" type="text" class="form-input" placeholder="f.eks. Klassisk Avocado Toast" required />
      </div>
      <div>
        <label class="form-label">Beskrivelse</label>
        <textarea
          v-model="form.description"
          class="form-input resize-none"
          rows="3"
          placeholder="En kort beskrivelse af opskriften..."
        />
      </div>
      <div class="w-32">
        <label class="form-label">Portioner</label>
        <input
          v-model.number="form.servings"
          type="number"
          class="form-input"
          placeholder="f.eks. 4"
          min="1"
        />
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Categories -->
    <div>
      <label class="form-label mb-2.5">Kategorier *</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          type="button"
          class="px-4 py-2 rounded-full text-[13px] font-body font-medium border transition-all duration-150 whitespace-nowrap"
          :class="form.categories.includes(cat)
            ? 'bg-charcoal-800 text-white border-charcoal-800'
            : 'border-charcoal-800/10 text-charcoal-700/70 hover:border-charcoal-800/25 hover:text-charcoal-800'"
          @click="toggleCategory(cat)"
        >
          {{ CATEGORY_LABELS[cat] ?? cat }}
        </button>
      </div>
      <p v-if="form.categories.length === 0" class="text-[12px] text-red-400 mt-2">Vælg mindst én kategori</p>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Nutrition -->
    <div>
      <label class="form-label mb-5">Næring</label>
      <div class="grid sm:grid-cols-2 gap-5">
        <!-- Calories -->
        <div>
          <label class="text-[12px] font-body font-medium text-charcoal-700/50 mb-1.5 block tracking-wide ">Kalorier (kcal)</label>
          <input
            v-model.number="form.estimated_calories"
            type="number"
            class="form-input"
            placeholder="f.eks. 450"
            min="0"
          />
        </div>
        <!-- Macros -->
        <div class="sm:col-span-2 grid grid-cols-3 gap-3">
          <div>
            <label class="text-[12px] font-body font-medium mb-1.5 block" style="color: #5C3D2E">Protein (g)</label>
            <input v-model.number="form.protein" type="number" class="form-input" placeholder="f.eks. 12" min="0" step="0.1" />
          </div>
          <div>
            <label class="text-[12px] font-body font-medium mb-1.5 block" style="color: #A8724A">Kulhydrater (g)</label>
            <input v-model.number="form.carbs" type="number" class="form-input" placeholder="f.eks. 54" min="0" step="0.1" />
          </div>
          <div>
            <label class="text-[12px] font-body font-medium mb-1.5 block" style="color: #8B7355">Fedt (g)</label>
            <input v-model.number="form.fat" type="number" class="form-input" placeholder="f.eks. 24" min="0" step="0.1" />
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Image -->
    <div>
      <label class="form-label mb-3">Billede</label>
      <div class="flex items-center gap-4">
        <div
          v-if="imagePreview || form.image_url"
          class="w-20 h-20 rounded-[14px] overflow-hidden flex-shrink-0 bg-cream-100"
        >
          <img :src="imagePreview || form.image_url || ''" alt="Forhåndsvisning" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-20 h-20 rounded-[14px] flex-shrink-0 bg-cream-100 flex items-center justify-center border border-charcoal-800/[0.06]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-charcoal-700/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="sr-only"
            @change="handleImageSelect"
          />
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="btn-secondary text-[13px] py-2 px-4 flex-shrink-0"
              @click="fileInputRef?.click()"
            >
              Vælg fil
            </button>
            <span class="text-[13px] font-body text-charcoal-700/35 truncate">
              {{ fileName || 'Ingen fil valgt' }}
            </span>
          </div>
          <p class="text-[12px] font-body text-charcoal-700/35 mt-1.5">JPG, PNG, WebP</p>
        </div>
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Ingredients -->
    <div>
      <label class="form-label mb-3">Ingredienser</label>
      <IngredientList v-model="form.ingredients" />
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Directions -->
    <div>
      <label class="form-label mb-3">Fremgangsmåde</label>
      <div class="space-y-3">
        <div
          v-for="(step, index) in form.directions"
          :key="index"
          class="flex gap-3 items-start"
        >
          <span
            class="flex-shrink-0 w-6 h-6 rounded-full text-white text-[11px] font-body font-bold flex items-center justify-center mt-3.5 transition-colors duration-150"
            :class="importantSteps[index] ? 'bg-sunlit' : 'bg-charcoal-800'"
          >
            {{ index + 1 }}
          </span>
          <textarea
            v-model="form.directions[index]"
            class="form-input resize-none flex-1"
            rows="2"
            :placeholder="`Trin ${index + 1}…`"
          />
          <button
            type="button"
            class="flex-shrink-0 mt-3.5 w-6 h-6 flex items-center justify-center transition-colors"
            :class="importantSteps[index] ? 'text-sunlit' : 'text-charcoal-700/20 hover:text-charcoal-700/40'"
            title="Marker som vigtigt trin"
            @click="importantSteps[index] = !importantSteps[index]"
          >
            <svg v-if="importantSteps[index]" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </button>
          <button
            type="button"
            class="flex-shrink-0 mt-3.5 w-6 h-6 flex items-center justify-center text-charcoal-700/25 hover:text-red-400 transition-colors"
            @click="removeStep(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button type="button" class="btn-ghost text-[13px] mt-1" @click="addStep">
          + Tilføj trin
        </button>
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button type="submit" class="btn-primary" :disabled="saving">
        {{ saving ? 'Gemmer…' : (isEdit ? 'Gem ændringer' : 'Opret opskrift') }}
      </button>
      <NuxtLink to="/admin" class="btn-ghost text-[13px]">Annuller</NuxtLink>
    </div>

    <p v-if="error" class="text-[13px] font-body text-red-500">{{ error }}</p>
  </form>

  <ImageCropper v-if="showCropper" :src="cropSrc" @crop="handleCropped" @cancel="cancelCrop" />
</template>

<script setup lang="ts">
import type { Recipe, RecipeInsert } from '~/types/recipe'
import { CATEGORIES, CATEGORY_LABELS } from '~/types/recipe'

const props = defineProps<{
  recipe?: Recipe
  prefill?: Partial<RecipeInsert>
}>()

const emit = defineEmits<{
  submit: [data: RecipeInsert, imageFile: File | null]
}>()

const { categories } = useCategories()
const saving = ref(false)
const error = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileName = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const showCropper = ref(false)
const cropSrc = ref('')
const cropFileName = ref('')

const _rawDirs = props.recipe?.directions ?? props.prefill?.directions ?? ['']
const importantSteps = ref<boolean[]>(_rawDirs.map(d => d.startsWith('[!]')))

const form = reactive<RecipeInsert>({
  title: props.recipe?.title ?? props.prefill?.title ?? '',
  description: props.recipe?.description ?? props.prefill?.description ?? '',
  categories: props.recipe?.categories ?? props.prefill?.categories ?? [],
  ingredients: props.recipe?.ingredients ?? props.prefill?.ingredients ?? [{ amount: '', unit: '', item: '' }],
  directions: _rawDirs.map(d => d.replace(/^\[!\]/, '')),
  servings: props.recipe?.servings ?? props.prefill?.servings ?? null,
  estimated_calories: props.recipe?.estimated_calories ?? props.prefill?.estimated_calories ?? null,
  protein: props.recipe?.protein ?? props.prefill?.protein ?? null,
  carbs: props.recipe?.carbs ?? props.prefill?.carbs ?? null,
  fat: props.recipe?.fat ?? props.prefill?.fat ?? null,
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
  cropFileName.value = file.name
  cropSrc.value = URL.createObjectURL(file)
  showCropper.value = true
  // Reset input so the same file can be re-selected if cropping is cancelled
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleCropped = (file: File) => {
  if (cropSrc.value) URL.revokeObjectURL(cropSrc.value)
  cropSrc.value = ''
  showCropper.value = false
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  fileName.value = cropFileName.value
}

const cancelCrop = () => {
  if (cropSrc.value) URL.revokeObjectURL(cropSrc.value)
  cropSrc.value = ''
  showCropper.value = false
}

const addStep = () => {
  form.directions.push('')
  importantSteps.value.push(false)
}
const removeStep = (index: number) => {
  form.directions.splice(index, 1)
  importantSteps.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (form.categories.length === 0) {
    error.value = 'Vælg mindst én kategori.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const dirPairs = form.directions
      .map((d, i) => ({ text: d, important: importantSteps.value[i] ?? false }))
      .filter(p => p.text.trim())
    const cleanedForm: RecipeInsert = {
      ...form,
      ingredients: form.ingredients.filter(i => i.item.trim()),
      directions: dirPairs.map(p => p.important ? '[!]' + p.text : p.text),
    }
    emit('submit', cleanedForm, imageFile.value)
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Noget gik galt.'
    saving.value = false
  }
}

defineExpose({
  setSaving: (val: boolean) => { saving.value = val },
  setError: (msg: string) => { error.value = msg },
})
</script>
