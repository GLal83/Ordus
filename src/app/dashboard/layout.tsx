import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAuth()
  
  if (!session) {
    redirect('/login')
  }

  return <div>{children}</div>
}