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
          <NuxtLink to="/favorites" class="btn-ghost text-[13px]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Favoritter
          </NuxtLink>
          <NuxtLink to="/admin" class="btn-ghost text-[13px]">Admin</NuxtLink>
        </template>
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
