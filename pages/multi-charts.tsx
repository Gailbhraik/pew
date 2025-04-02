import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Cette page sert de redirection de secours pour s'assurer que /multi-charts est accessible
export default function MultiChartsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/multi-charts')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
