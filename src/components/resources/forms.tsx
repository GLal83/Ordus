'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Form {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: string;
}

interface FormsByCategory {
  [key: string]: Form[];
}

const forms: FormsByCategory = {
  'Accident Benefits': [
    { 
      id: 'ocf1', 
      title: 'OCF-1: Application for Accident Benefits', 
      description: 'Initial application form for accident benefits',
      url: '/forms/accident-benefits/OCF-1 Application for Accident Benefits.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf2', 
      title: 'OCF-2: Employer\'s Confirmation Form', 
      description: 'Employer confirmation of income and other employment information',
      url: '/forms/accident-benefits/OCF-2 Employers Confirmation Form.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf3', 
      title: 'OCF-3: Disability Certificate', 
      description: 'Medical practitioner\'s assessment of disability',
      url: '/forms/accident-benefits/OCF-3 Disability Certificate.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf4', 
      title: 'OCF-4: Death and Funeral Benefits Application', 
      description: 'Application for death and funeral benefits',
      url: '/forms/accident-benefits/OCF-4 Death and Funeral Benefits Application.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf6', 
      title: 'OCF-6: Expenses Claim Form', 
      description: 'Form for claiming various accident benefits expenses',
      url: '/forms/accident-benefits/OCF-6 Expenses Claim Form.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf10', 
      title: 'OCF-10: Election of Benefits', 
      description: 'Form to elect between different benefit options',
      url: '/forms/accident-benefits/OCF-10 Election of Benefit.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    },
    { 
      id: 'ocf19', 
      title: 'OCF-19: Catastrophic Impairment Application', 
      description: 'Application for determination of catastrophic impairment',
      url: '/forms/accident-benefits/OCF-19 Application for Determination of Catastrophic Impairment.pdf',
      category: 'Accident Benefits',
      type: 'PDF'
    }
  ],
  'Personal Injury': [
    { 
      id: 'pi1', 
      title: 'Client Information Form', 
      description: 'Personal Injury Client Information Form',
      url: '/forms/client-info.pdf',
      category: 'Personal Injury',
      type: 'PDF'
    },
    { 
      id: 'pi2', 
      title: 'Medical Authorization', 
      description: 'Medical Records Authorization Form',
      url: '/forms/med-auth.pdf',
      category: 'Personal Injury',
      type: 'PDF'
    },
  ]
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Accident Benefits':
      return "from-purple-500/20 via-purple-600/20 to-purple-700/20"
    case 'Personal Injury':
      return "from-blue-500/20 via-blue-600/20 to-blue-700/20"
    default:
      return "from-gray-500/20 via-gray-600/20 to-gray-700/20"
  }
}

export function Forms() {
  const [searchQuery, setSearchQuery] = useState("")
  const allForms = Object.entries(forms).flatMap(([category, items]) => 
    items.map(form => ({ ...form, category }))
  )

  const filteredForms = allForms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = Object.keys(forms)
  const filteredCategories = Array.from(new Set(filteredForms.map(form => form.category)))

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
                <h1 className="text-2xl font-bold text-white">Forms</h1>
                <p className="text-sm text-gray-300">Standard Forms & Templates</p>
              </div>
            </div>
            <Badge className="bg-white/80 text-gray-700 font-medium border border-gray-200/50">
              {filteredForms.length} items
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search forms..."
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
                    {filteredForms.filter(form => form.category === category).length} items
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {category} forms and templates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredForms
                    .filter(form => form.category === category)
                    .map((form) => (
                      <div 
                        key={form.id}
                        className="flex items-start justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{form.title}</h3>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {form.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {form.description}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(form.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download {form.title}</span>
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