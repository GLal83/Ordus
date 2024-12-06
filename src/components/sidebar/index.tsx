'use client'

import { useState } from 'react'
import { Calendar, FileText, Home, LayersIcon, Library, MessageSquareText, Settings, Users, ChevronDown, ChevronRight, Scale, BookOpen, Link as LinkIcon, Mail, Search, Book } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onTabChange: (tab: string) => void
}

export function Sidebar({ className, onTabChange }: SidebarProps) {
  const [isCasesOpen, setIsCasesOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  return (
    <div className={cn("pb-12 min-h-screen w-60 bg-[#1a2234]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <img
            src="/placeholder.svg?height=40&width=120"
            alt="Ordus"
            className="h-10"
          />
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
              onClick={() => onTabChange('dashboard')}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-white/10"
                onClick={() => setIsCasesOpen(!isCasesOpen)}
              >
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Cases
                </div>
                {isCasesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {isCasesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('all-cases')}
                  >
                    All Clients
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('new-case')}
                  >
                    New Case
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <LayersIcon className="mr-2 h-4 w-4" />
              Benefits
            </Button>
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-white/10"
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              >
                <div className="flex items-center">
                  <Library className="mr-2 h-4 w-4" />
                  Resources
                </div>
                {isResourcesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {isResourcesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-forms')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Forms
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-precedents')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Precedents
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-legislation')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Legislation
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-manuals')}
                  >
                    <Book className="mr-2 h-4 w-4" />
                    Manuals & Materials
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-links')}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Useful Links
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-letters')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Request Letters
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start pl-6 text-white hover:bg-white/10"
                    onClick={() => onTabChange('resources-caselaw')}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Case Law
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}