<template>
  <nav class="bg-white border-b border-cream-200">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="font-display font-bold text-xl text-spice-500">Cally</NuxtLink>
        <span class="text-charcoal-700/30">|</span>
        <span class="text-sm font-semibold text-charcoal-700">Admin</span>
        <NuxtLink to="/admin" class="text-sm text-charcoal-700 hover:text-spice-500 transition-colors">
          Recipes
        </NuxtLink>
        <NuxtLink to="/admin/recipes/new" class="text-sm text-charcoal-700 hover:text-spice-500 transition-colors">
          + New Recipe
        </NuxtLink>
      </div>
      <button class="btn-ghost text-sm" @click="logout">
        Sign out
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { logout } = useAuth()
</script>
