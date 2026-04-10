<template>
  <nav class="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-xl border-b border-charcoal-800/[0.06]">
    <div class="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <NuxtLink to="/" class="font-display text-[22px] font-semibold text-charcoal-800 tracking-tight leading-none mr-3 transition-opacity duration-200 hover:opacity-60">
          Cally
        </NuxtLink>
        <span class="text-charcoal-800/20 text-sm mr-3">/</span>
        <NuxtLink to="/admin" class="btn-ghost text-[13px]">Dashboard</NuxtLink>
        <NuxtLink to="/admin/plans" class="btn-ghost text-[13px]">Ugeplaner</NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <!-- User identity -->
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center flex-shrink-0">
            <span class="text-[11px] font-body font-semibold text-white uppercase leading-none">{{ userInitial }}</span>
          </div>
        </div>

        <span class="text-charcoal-800/15 text-sm">|</span>

        <!-- Logout -->
        <button class="btn-ghost text-[13px]" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Log ud
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()
const userEmail = computed(() => user.value?.email ?? '')
const userInitial = computed(() => userEmail.value.charAt(0))
</script>
