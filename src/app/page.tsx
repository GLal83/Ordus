'use client'

import { useState } from 'react'
import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { StatusCard } from "@/components/status-card"
import { NewCase } from "@/components/new-case"
import { AllClients } from "@/components/all-clients"
import { CaseDetails } from "@/components/case-details"
import { Resources } from "@/components/resources"

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId)
    setActiveTab('case-details')
  }

  const getPageTitle = () => {
    if (activeTab === 'new-case') return 'New Case'
    if (activeTab === 'all-cases') return 'All Clients'
    if (activeTab === 'case-details') return 'Case Details'
    if (activeTab.startsWith('resources-')) {
      const resourceType = activeTab.split('-')[1]
      return resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
    }
    return 'Dashboard'
  }

  return (
    <div className="flex min-h-screen" style={{
      backgroundImage: 'url(/images/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Sidebar onTabChange={setActiveTab} />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {getPageTitle()}
          </h2>
          <div className="flex items-center space-x-4">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/10 h-9 w-9 p-0"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/10 h-9 w-9 p-0"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard
                  type="activities"
                  title="Recent Activities"
                  description="Your latest case updates"
                  content={[
                    "3 new documents uploaded",
                    'Case #1234 status changed to "In Review"',
                  ]}
                />
                <StatusCard
                  type="deadlines"
                  title="Upcoming Deadlines"
                  description="Don't miss these important dates"
                  content={[
                    "File review due by 2 PM",
                    "Client meeting at 3:30 PM",
                  ]}
                />
                <StatusCard
                  type="suggestions"
                  title="AI Suggestions"
                  description="Insights from Ordus AI"
                  content={[
                    "Consider requesting an extension for Case #5678",
                    "New precedent found relevant to Case #9101",
                  ]}
                />
              </div>
            </div>
          )}
          <div>
            {activeTab === 'new-case' && <NewCase />}
            {activeTab === 'all-cases' && <AllClients onCaseSelect={handleCaseSelect} />}
            {activeTab === 'case-details' && selectedCaseId && <CaseDetails caseId={selectedCaseId} />}
            {activeTab.startsWith('resources-') && <Resources activeTab={activeTab} />}
          </div>
        </div>
      </div>
    </div>
  )
}