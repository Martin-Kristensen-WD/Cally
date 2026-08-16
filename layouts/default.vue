<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader class="print:hidden" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter class="print:hidden" />
  </div>
</template>
