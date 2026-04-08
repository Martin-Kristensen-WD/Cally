<template>
  <header class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-cream-200">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="font-display text-2xl font-bold text-spice-500">Cally</span>
        <span class="hidden sm:block text-charcoal-700/50 text-sm">· food inspiration</span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink to="/" class="text-sm font-medium text-charcoal-700 hover:text-spice-500 transition-colors">
          Recipes
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/admin"
          class="btn-primary text-xs py-2 px-4"
        >
          Admin
        </NuxtLink>
        <NuxtLink
          v-else
          to="/admin/login"
          class="btn-ghost text-xs"
        >
          Sign in
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAdmin } = useAuth()
</script>
