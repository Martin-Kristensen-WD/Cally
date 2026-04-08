export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const config = useRuntimeConfig()

  const login = async (password: string) => {
    const email = config.public.adminEmail as string
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/admin/login')
  }

  const isAdmin = computed(() => !!user.value)

  return { login, logout, isAdmin, user }
}
