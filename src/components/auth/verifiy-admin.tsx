'use client'

// import { redirect } from 'next/navigation'
// import { useEffect } from 'react'

// import { useGetProfilePersonal } from '@/hooks/use-query-data'

export function VerifyAdmin({ children }: { children: React.ReactNode }) {
  // const email = localStorage.getItem('email') || undefined
  // const password = localStorage.getItem('password') || undefined

  // const { data } = useGetProfilePersonal(email, password)

  // useEffect(() => {
  //   if (data && data.role !== 'ADMIN') {
  //     redirect('/')
  //   }
  // }, [data])

  return <>{children}</>
}
