import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EXISTING_MATERIALS = [
  {
    name: 'AB MANUAL.pdf',
    type: 'MANUAL',
    category: 'Accident Benefits',
    description: 'Accident Benefits Manual',
    url: '/materials/AB MANUAL.pdf'
  },
  {
    name: 'AMA Guides Fourth Edition.pdf',
    type: 'MANUAL',
    category: 'Medical Assessment',
    description: 'AMA Guides to the Evaluation of Permanent Impairment - 4th Edition',
    url: '/materials/AMA Guides Fourth Edition.pdf'
  },
  {
    name: 'AMA Guides To The Evaluation of Permanent Impairment 6th Ed.pdf',
    type: 'MANUAL',
    category: 'Medical Assessment',
    description: 'AMA Guides to the Evaluation of Permanent Impairment - 6th Edition',
    url: '/materials/AMA Guides To The Evaluation of Permanent Impairment 6th Ed.pdf'
  },
  {
    name: 'CAT_Impairment.pdf',
    type: 'MANUAL',
    category: 'Medical Assessment',
    description: 'Catastrophic Impairment Guidelines',
    url: '/materials/CAT_Impairment.pdf'
  },
  {
    name: 'Causation-in-SABS-Claims-The-Proper-Test.pdf',
    type: 'MANUAL',
    category: 'Legal Reference',
    description: 'Causation in SABS Claims - The Proper Test',
    url: '/materials/Causation-in-SABS-Claims-The-Proper-Test.pdf'
  }
]

export async function POST(request: NextRequest) {
  try {
    const materials = await Promise.all(
      EXISTING_MATERIALS.map(material => 
        prisma.resourceDocument.create({
          data: {
            name: material.name,
            type: material.type,
            category: material.category,
            description: material.description,
            content: material.url,
            url: material.url
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      count: materials.length,
      materials
    })
  } catch (error) {
    console.error('Error registering materials:', error)
    return NextResponse.json(
      { error: 'Error registering materials' },
      { status: 500 }
    )
  }
} 