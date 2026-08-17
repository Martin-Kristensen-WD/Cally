<template>
  <form class="space-y-8" @submit.prevent @keydown.meta.enter="handleSubmit" @keydown.ctrl.enter="handleSubmit">

    <!-- Title -->
    <div>
      <label class="form-label">Titel *</label>
      <input v-model="form.name" type="text" class="form-input" placeholder="f.eks. Rosiner" required />
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Amount + Measure + Kcal -->
    <div class="flex gap-4">
      <div class="w-24">
        <label class="form-label">Antal *</label>
        <input v-model.number="form.reference_amount" type="number" class="form-input" placeholder="f.eks. 250" min="0" step="any" required />
      </div>
      <div class="w-28">
        <label class="form-label">Mål *</label>
        <select v-model="form.unit" class="form-input" required>
          <option value="" disabled>Enhed</option>
          <option v-for="u in UNITS" :key="u.value" :value="u.value">{{ u.label }}</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="form-label">Kcal *</label>
        <input v-model.number="form.reference_calories" type="number" class="form-input" placeholder="f.eks. 299" min="0" step="any" required />
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Image -->
    <div>
      <label class="form-label mb-3">Billede <span class="text-charcoal-700/35 font-normal text-[12px]">– valgfri</span></label>
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

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button type="button" class="btn-primary" :disabled="saving" @click="handleSubmit">
        {{ saving ? 'Gemmer…' : (isEdit ? 'Gem ændringer' : 'Opret fødevare') }}
      </button>
      <NuxtLink to="/admin/food-items" class="btn-ghost text-[13px]">Annuller</NuxtLink>
    </div>

    <p v-if="error" class="text-[13px] font-body text-red-500">{{ error }}</p>
  </form>

  <ImageCropper v-if="showCropper" :src="cropSrc" @crop="handleCropped" @cancel="cancelCrop" />
</template>

<script setup lang="ts">
import type { FoodItem, FoodItemInsert } from '~/types/foodItem'
import { UNITS } from '~/types/units'

const props = defineProps<{
  foodItem?: FoodItem
  prefill?: Partial<FoodItemInsert>
}>()

const emit = defineEmits<{
  submit: [data: FoodItemInsert, imageFile: File | null]
}>()

const saving = ref(false)
const error = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileName = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const showCropper = ref(false)
const cropSrc = ref('')
const cropFileName = ref('')

const form = reactive<FoodItemInsert>({
  name: props.foodItem?.name ?? props.prefill?.name ?? '',
  unit: props.foodItem?.unit ?? props.prefill?.unit ?? '',
  reference_amount: props.foodItem?.reference_amount ?? props.prefill?.reference_amount ?? 100,
  reference_calories: props.foodItem?.reference_calories ?? props.prefill?.reference_calories ?? 0,
  image_url: props.foodItem?.image_url ?? null,
})

const isEdit = computed(() => !!props.foodItem)

const handleImageSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  cropFileName.value = file.name
  cropSrc.value = URL.createObjectURL(file)
  showCropper.value = true
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

const handleSubmit = async () => {
  if (!form.name.trim()) {
    error.value = 'Titel er påkrævet.'
    return
  }
  if (!form.unit) {
    error.value = 'Vælg et mål.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    emit('submit', { ...form }, imageFile.value)
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
