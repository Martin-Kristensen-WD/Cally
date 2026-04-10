<template>
  <header class="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-xl border-b border-charcoal-800/[0.06]">
    <div class="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="group">
        <span class="font-display text-[22px] font-semibold text-charcoal-800 tracking-tight leading-none transition-opacity duration-200 group-hover:opacity-60">
          Cally
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <template v-if="isAdmin">
          <NuxtLink to="/favorites" class="btn-ghost text-[13px]">Favoritter</NuxtLink>
          <NuxtLink to="/admin/plans" class="btn-ghost text-[13px]">Ugeplaner</NuxtLink>

          <span class="text-charcoal-800/15 text-sm mx-1">|</span>

          <NuxtLink to="/admin" class="btn-ghost text-[13px]">Dashboard</NuxtLink>

          <!-- Avatar + dropdown -->
          <div ref="avatarRef" class="relative ml-1">
            <button
              class="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-70"
              @click="dropdownOpen = !dropdownOpen"
            >
              <span class="text-[11px] font-body font-semibold text-white uppercase leading-none">{{ userInitial }}</span>
            </button>

            <Transition
              enter-active-class="transition duration-100 ease-out origin-top-right"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-75 ease-in origin-top-right"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="dropdownOpen"
                class="absolute right-0 top-full mt-2 w-52 bg-white rounded-[14px] overflow-hidden"
                style="box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)"
              >
                <div class="px-4 py-3 border-b border-charcoal-800/[0.06]">
                  <p class="text-[11px] font-body text-charcoal-700/40 truncate">{{ userEmail }}</p>
                </div>
                <button
                  class="w-full text-left px-4 py-3 text-[13px] font-body text-charcoal-700/70 hover:bg-cream-50 hover:text-charcoal-800 transition-colors flex items-center gap-2.5"
                  @click="handleLogout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Log ud
                </button>
              </div>
            </Transition>
          </div>
        </template>

        <NuxtLink
          v-else
          to="/admin/login"
          class="btn-ghost text-[13px]"
        >
          Log ind
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAdmin, logout, user } = useAuth()

const userEmail = computed(() => user.value?.email ?? '')
const userInitial = computed(() => userEmail.value.charAt(0))

const dropdownOpen = ref(false)
const avatarRef = ref<HTMLElement | null>(null)

const handleLogout = async () => {
  dropdownOpen.value = false
  await logout()
}

const handleClickOutside = (e: MouseEvent) => {
  if (avatarRef.value && !avatarRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
