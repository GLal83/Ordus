'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Precedent {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: string;
}

interface PrecedentsByCategory {
  [key: string]: Precedent[];
}

const precedents: PrecedentsByCategory = {
  'Memos': [
    {
      id: 'memo1',
      title: 'Pre-Hearing Memo',
      description: 'Sample pre-hearing memorandum template',
      url: '/precedents/Pre-Hearing Memo - August 26, 2023.pdf',
      category: 'Memos',
      type: 'PDF'
    },
    {
      id: 'memo2',
      title: 'Running Memo',
      description: 'Sample running memorandum template',
      url: '/precedents/Running Memo- Sample.pdf',
      category: 'Memos',
      type: 'PDF'
    }
  ]
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Memos':
      return "from-blue-500/20 via-blue-600/20 to-blue-700/20"
    default:
      return "from-gray-500/20 via-gray-600/20 to-gray-700/20"
  }
}

export function Precedents() {
  const [searchQuery, setSearchQuery] = useState("")
  const allPrecedents = Object.entries(precedents).flatMap(([category, items]) => 
    items.map(precedent => ({ ...precedent, category }))
  )

  const filteredPrecedents = allPrecedents.filter(precedent => 
    precedent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    precedent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    precedent.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = Array.from(new Set(filteredPrecedents.map(precedent => precedent.category)))

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Precedents</h1>
                <p className="text-sm text-gray-300">Legal Templates & Samples</p>
              </div>
            </div>
            <Badge className="bg-white/80 text-gray-700 font-medium border border-gray-200/50">
              {filteredPrecedents.length} items
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search precedents..."
              className="pl-8 bg-white/50 border-gray-200 focus-visible:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6">
          {filteredCategories.map((category) => (
            <Card 
              key={category} 
              className="bg-white/90 backdrop-blur-sm shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className={`bg-gradient-to-r ${getCategoryStyle(category)} py-4 px-4`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {category}
                  </CardTitle>
                  <Badge className="bg-white/80 text-gray-700 font-medium border border-gray-200/50">
                    {filteredPrecedents.filter(precedent => precedent.category === category).length} items
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {category} templates and samples
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredPrecedents
                    .filter(precedent => precedent.category === category)
                    .map((precedent) => (
                      <div 
                        key={precedent.id}
                        className="flex items-start justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{precedent.title}</h3>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {precedent.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {precedent.description}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(precedent.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download {precedent.title}</span>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
} 