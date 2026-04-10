<template>
  <nav class="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-xl border-b border-charcoal-800/[0.06]">
    <div class="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <NuxtLink to="/" class="font-display text-[22px] font-semibold text-charcoal-800 tracking-tight leading-none mr-3 transition-opacity duration-200 hover:opacity-60">
          Cally
        </NuxtLink>
        <span class="text-charcoal-800/20 text-sm mr-3">/</span>
        <NuxtLink to="/admin" class="btn-ghost text-[13px]">Opskrifter</NuxtLink>
        <NuxtLink to="/admin/recipes/new" class="btn-ghost text-[13px]">Ny opskrift</NuxtLink>
      </div>
      <button class="btn-ghost text-[13px]" @click="logout">
        Log ud
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { logout } = useAuth()
</script>
