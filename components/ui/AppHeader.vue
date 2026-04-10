<template>
  <header class="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-xl border-b border-charcoal-800/[0.06]">
    <div class="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="group">
        <span class="font-display text-[22px] font-semibold text-charcoal-800 tracking-tight leading-none transition-opacity duration-200 group-hover:opacity-60">
          Cally
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <NuxtLink
          v-if="isAdmin"
          to="/admin"
          class="btn-ghost text-[13px]"
        >
          Admin
        </NuxtLink>
        <NuxtLink
          v-else
          to="/admin/login"
          class="btn-ghost text-[13px]"
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
