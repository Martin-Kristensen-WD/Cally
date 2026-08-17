<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Dashboard</p>
        <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight leading-none">Fødevarer</h1>
      </div>
      <NuxtLink to="/admin/food-items/new" class="btn-primary">+ Ny fødevare</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="n in 3" :key="n" class="bg-white rounded-[20px] h-20 animate-pulse" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />
    </div>

    <!-- List -->
    <div v-else-if="foodItems?.length" class="bg-white rounded-[20px] overflow-hidden" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <div class="px-6 py-4 border-b border-charcoal-800/[0.05] flex items-center gap-3">
        <input
          type="checkbox"
          :checked="allSelected"
          class="w-4 h-4 cursor-pointer flex-shrink-0"
          style="accent-color: #A8724A"
          @change="toggleSelectAll"
        />
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase flex-1">Alle fødevarer</p>
        <button
          v-if="someSelected"
          class="text-[12px] font-body font-medium text-red-500 hover:text-red-600 transition-colors"
          @click="handleBulkDelete"
        >
          Slet valgte ({{ selectedIds.length }})
        </button>
        <span v-else class="text-[12px] font-body text-charcoal-700/30">{{ foodItems.length }} stk.</span>
      </div>

      <ul class="divide-y divide-charcoal-800/[0.04]">
        <li
          v-for="item in foodItems"
          :key="item.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-cream-50/60 transition-colors group"
          :class="{ 'bg-cream-50': isSelected(item.id) }"
        >
          <input
            type="checkbox"
            :checked="isSelected(item.id)"
            class="w-4 h-4 cursor-pointer flex-shrink-0"
            style="accent-color: #A8724A"
            @change="toggleSelect(item.id)"
          />

          <!-- Thumbnail -->
          <div class="w-11 h-11 rounded-[10px] overflow-hidden bg-cream-100 flex-shrink-0">
            <img
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center" style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)">
              <span class="font-display font-semibold leading-none select-none text-[1.25rem] text-charcoal-800/20">{{ item.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- Name + nutrition -->
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-body font-semibold text-charcoal-800 truncate">{{ item.name }}</p>
            <p class="text-[12px] font-body text-charcoal-700/40 mt-0.5">
              {{ item.reference_calories }} kcal / {{ formatAmountUnit(item.reference_amount, item.unit) }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-150">
            <NuxtLink :to="`/admin/food-items/${item.id}/edit`" class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex">Rediger</NuxtLink>
            <NuxtLink :to="`/admin/food-items/${item.id}/edit`" class="btn-ghost text-[12px] py-1.5 px-2 sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </NuxtLink>
            <button class="btn-ghost text-[12px] py-1.5 px-3 text-red-400 hover:bg-red-50 hidden sm:inline-flex" @click="handleDelete(item.id)">Slet</button>
            <button class="btn-ghost text-[12px] py-1.5 px-2 text-red-400 hover:bg-red-50 sm:hidden" @click="handleDelete(item.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Empty -->
    <div v-else class="bg-white rounded-[20px] py-20 text-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-2">Ingen fødevarer endnu.</p>
      <p class="text-[13px] font-body text-charcoal-700/30 mb-6">Opret enkle fødevarer som rosiner eller juice til brug i ugeplaner.</p>
      <NuxtLink to="/admin/food-items/new" class="btn-primary">+ Opret fødevare</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchFoodItems, deleteFoodItem, deleteFoodItems } = useFoodItems()

const { data: foodItems, pending, refresh } = await useAsyncData(
  'admin-food-items',
  () => fetchFoodItems(),
  { server: false },
)

const selectedIds = ref<string[]>([])

const allSelected = computed(() =>
  (foodItems.value?.length ?? 0) > 0 && foodItems.value?.every(i => selectedIds.value.includes(i.id)) === true
)
const someSelected = computed(() => selectedIds.value.length > 0)

const isSelected = (id: string) => selectedIds.value.includes(id)

const toggleSelect = (id: string) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = foodItems.value?.map(i => i.id) ?? []
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Slet denne fødevare?')) return
  await deleteFoodItem(id)
  await refresh()
}

const handleBulkDelete = async () => {
  const count = selectedIds.value.length
  if (!confirm(`Slet ${count} fødevare${count === 1 ? '' : 'r'}? Dette kan ikke fortrydes.`)) return
  await deleteFoodItems([...selectedIds.value])
  selectedIds.value = []
  await refresh()
}
</script>
