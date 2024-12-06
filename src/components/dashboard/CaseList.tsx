// src/components/dashboard/CaseList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'

interface Case {
 id: string
 fileNo: string
 clientName: string
 caseType: string
 status: string
 users: User[]
}

interface User {
 id: string
 name: string
 role: string
}

export default function CaseList() {
 const [cases, setCases] = useState<Case[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
   fetchUserCases()
 }, [])

 const fetchUserCases = async () => {
   try {
     const response = await fetch('/api/cases/user')
     const data = await response.json()
     setCases(data)
   } catch (error) {
     console.error('Error fetching cases:', error)
   } finally {
     setLoading(false)
   }
 }

 const handleManageUsers = async (caseId: string) => {
   // Open modal for user management
 }

 if (loading) return <div>Loading cases...</div>

 return (
   <Card className="p-4">
     <div className="space-y-4">
       {cases.map(caseItem => (
         <div key={caseItem.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
           <div>
             <h3 className="font-medium">{caseItem.clientName}</h3>
             <p className="text-sm text-gray-500">
               File: {caseItem.fileNo} | {caseItem.caseType}
             </p>
             <div className="flex gap-2 mt-2">
               {caseItem.users.map(user => (
                 <span key={user.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                   {user.name} ({user.role})
                 </span>
               ))}
             </div>
           </div>
           <Button
             variant="ghost"
             size="sm"
             onClick={() => handleManageUsers(caseItem.id)}
             className="ml-4"
           >
             <UserPlus className="h-4 w-4" />
           </Button>
         </div>
       ))}
     </div>
   </Card>
 )
}