// hooks/useAuthPersonal.ts
// "use client"

// import { useMutation } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'

// import { profilePersonal } from '@/app/http/personal/profile-personal'
// import { useAuth } from '@/context/AuthContextPersonal'

export function useAuthPersonal() {
  // const router = useRouter()
  // const { login } = useAuth()

  // const mutation = useMutation({
  //   mutationFn: ({ email, password }: { email: string; password: string }) => 
  //     profilePersonal({ email, password }),
  //   onSuccess: (data) => {
  //     login(data)
  //     router.push('/admin')
  //   }
  // })

  // return {
  //   login: (email: string, password: string) => mutation.mutate({ email, password }),
  //   loading: mutation.isPending,
  //   error: mutation.error ? 'Credenciais inválidas' : null
  // }
}

// export { useAuth }
