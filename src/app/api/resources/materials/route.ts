import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public', 'materials')
    const files = await readdir(publicDir)

    const materials = files
      .filter(file => file.endsWith('.pdf')) // Only get PDF files
      .map(file => ({
        id: file,
        name: file,
        type: 'MANUAL',
        category: 'Reference Materials',
        url: `/materials/${file}`
      }))

    return NextResponse.json({ materials })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { 
        error: 'Error fetching materials',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}