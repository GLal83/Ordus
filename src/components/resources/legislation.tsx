'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ExternalLink, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface LegislationLink {
  title: string;
  description: string;
  url: string;
  category: string;
  lastUpdated?: string;
  tag?: string;
}

const legislationLinks: LegislationLink[] = [
  {
    title: "Insurance Act",
    description: "The Insurance Act and related regulations",
    url: "https://www.ontario.ca/laws/statute/90i08",
    category: "Insurance",
    lastUpdated: "2024-01-15",
    tag: "Key Legislation"
  },
  {
    title: "Statutory Accident Benefits Schedule",
    description: "Ontario Regulation 34/10: Statutory Accident Benefits Schedule - Effective September 1, 2010",
    url: "https://www.ontario.ca/laws/regulation/100034",
    category: "Insurance",
    lastUpdated: "2023-12-01",
    tag: "Regulation"
  },
  {
    title: "Courts of Justice Act",
    description: "Courts of Justice Act, RSO 1990, c C.43 - Fundamental legislation governing court procedures",
    url: "https://www.ontario.ca/laws/statute/90c43",
    category: "Legal Procedure",
    lastUpdated: "2024-02-01",
    tag: "Key Legislation"
  },
  {
    title: "Rules of Civil Procedure",
    description: "Rules of Civil Procedure, RRO 1990, Reg 194 - Comprehensive rules for civil proceedings",
    url: "https://www.ontario.ca/laws/regulation/900194",
    category: "Legal Procedure",
    lastUpdated: "2024-01-30",
    tag: "Regulation"
  },
  {
    title: "Limitations Act",
    description: "Limitations Act, 2002, SO 2002, c 24, Sch B - Time limits for commencing proceedings",
    url: "https://www.ontario.ca/laws/statute/02l24",
    category: "Legal Procedure",
    lastUpdated: "2023-11-15",
    tag: "Key Legislation"
  },
  {
    title: "Compulsory Automobile Insurance Act",
    description: "R.S.O. 1990, c. C.25 - Legislation governing mandatory auto insurance requirements in Ontario",
    url: "https://www.ontario.ca/laws/statute/90c25",
    category: "Insurance",
    lastUpdated: "2023-12-15",
    tag: "Key Legislation"
  },
  {
    title: "Highway Traffic Act",
    description: "R.S.O. 1990, c. H.8 - Comprehensive legislation governing road safety, traffic rules, and vehicle regulations",
    url: "https://www.ontario.ca/laws/statute/90h08",
    category: "Traffic Law",
    lastUpdated: "2024-01-20",
    tag: "Key Legislation"
  },
  {
    title: "Statutory Powers Procedure Act",
    description: "R.S.O. 1990, c. S.22 - Framework for administrative tribunals and procedural requirements",
    url: "https://www.ontario.ca/laws/statute/90s22",
    category: "Administrative Law",
    lastUpdated: "2023-11-30",
    tag: "Key Legislation"
  },
  {
    title: "Licence Appeal Tribunal Act",
    description: "S.O. 1999, c. 12, Sched. G - Legislation establishing and governing the LAT's authority",
    url: "https://www.ontario.ca/laws/statute/99l12",
    category: "Administrative Law",
    lastUpdated: "2023-10-15",
    tag: "Key Legislation"
  },
  {
    title: "LAT Rules of Practice and Procedure",
    description: "Current Rules of Practice and Procedure for the Licence Appeal Tribunal (Effective October 2, 2017)",
    url: "https://tribunalsontario.ca/documents/lat/LAT%20Rules%20of%20Practice%20and%20Procedure.html",
    category: "Administrative Law",
    lastUpdated: "2017-10-02",
    tag: "Tribunal Rules"
  },
  {
    title: "LAT General Rules (August 2023)",
    description: "Updated General Rules for the Licence Appeal Tribunal - Effective August 21, 2023",
    url: "https://tribunalsontario.ca/documents/lat/Rules/LAT%20General%20Rules.html",
    category: "Administrative Law",
    lastUpdated: "2023-08-21",
    tag: "Tribunal Rules"
  },
  {
    title: "FSRA Property and Casualty - Auto Bulletins",
    description: "Collection of regulatory guidance and bulletins from FSRA regarding auto insurance",
    url: "https://www.fsrao.ca/industry/auto-insurance/regulatory-framework/guidance-and-decisions/auto-insurance-bulletins",
    category: "Regulatory Guidance",
    lastUpdated: "2024-02-01",
    tag: "Bulletins"
  },
  {
    title: "Insurance Bureau Interpretation Guidelines",
    description: "Guidelines and interpretations for insurance regulations and procedures",
    url: "https://www.ibc.ca/on/resources/industry-resources/insurance-guidelines",
    category: "Regulatory Guidance",
    lastUpdated: "2024-01-25",
    tag: "Guidelines"
  }
]

const getTagStyle = (tag: string) => {
  switch (tag) {
    case 'Key Legislation':
      return "bg-blue-50 text-blue-700 border-blue-200"
    case 'Regulation':
      return "bg-purple-50 text-purple-700 border-purple-200"
    case 'Tribunal Rules':
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case 'Bulletins':
      return "bg-orange-50 text-orange-700 border-orange-200"
    case 'Guidelines':
      return "bg-rose-50 text-rose-700 border-rose-200"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200"
  }
}

const getCategoryStyle = (category: string) => {
  switch (category) {
    case 'Insurance':
      return "from-blue-500/20 via-blue-600/20 to-blue-700/20"
    case 'Legal Procedure':
      return "from-purple-500/20 via-purple-600/20 to-purple-700/20"
    case 'Traffic Law':
      return "from-emerald-500/20 via-emerald-600/20 to-emerald-700/20"
    case 'Administrative Law':
      return "from-orange-500/20 via-orange-600/20 to-orange-700/20"
    case 'Regulatory Guidance':
      return "from-rose-500/20 via-rose-600/20 to-rose-700/20"
    default:
      return "from-gray-500/20 via-gray-600/20 to-gray-700/20"
  }
}

export function Legislation() {
  const [searchQuery, setSearchQuery] = useState("")
  const categories = Array.from(new Set(legislationLinks.map(link => link.category)))

  const filteredLinks = legislationLinks.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = Array.from(new Set(filteredLinks.map(link => link.category)))

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Legislation
                </h1>
                <p className="text-sm text-gray-300">
                  Legal Reference Library
                </p>
              </div>
            </div>
            <Badge className="bg-white/80 text-gray-700 font-medium border border-gray-200/50">
              {filteredLinks.length} items
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search legislation..."
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
                    {filteredLinks.filter(link => link.category === category).length} items
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Important {category.toLowerCase()} legislation and regulations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredLinks
                    .filter(link => link.category === category)
                    .map((link, index) => (
                      <div 
                        key={link.title}
                        className="flex items-start justify-between p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-gray-900">{link.title}</h3>
                            {link.tag && (
                              <span className={`px-2 py-0.5 text-xs rounded-full border ${getTagStyle(link.tag)}`}>
                                {link.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {link.description}
                          </p>
                          {link.lastUpdated && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-gray-300" />
                              Updated {new Date(link.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open {link.title}</span>
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