<template>
  <div class="min-h-screen flex items-center justify-center bg-cream-100 px-4">
    <div class="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
      <div class="text-center mb-8">
        <a href="/" class="inline-flex items-center gap-1 text-sm text-charcoal-700/50 hover:text-spice-500 transition-colors mb-4">
          ← Back to recipes
        </a>
        <div>
          <span class="font-display text-3xl font-bold text-spice-500">Cally</span>
          <p class="text-sm text-charcoal-700/50 mt-1">Admin access</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Enter admin password"
            required
            autofocus
          />
        </div>

        <button type="submit" class="btn-primary w-full justify-center" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await login(password.value)
    await navigateTo('/admin')
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Login failed.'
  }
  finally {
    loading.value = false
  }
}
</script>
