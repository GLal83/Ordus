import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Create directory in public folder if it doesn't exist
    const publicDir = join(process.cwd(), 'public', 'materials', category.toLowerCase())
    await mkdir(publicDir, { recursive: true })

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`
    const filePath = join(publicDir, fileName)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create public URL path
    const publicUrl = `/materials/${category.toLowerCase()}/${fileName}`

    // Save to database
    const material = await prisma.resourceDocument.create({
      data: {
        name: file.name,
        type: 'MANUAL',
        category,
        description,
        content: publicUrl,  // Store the public URL instead of file path
        url: publicUrl
      }
    })

    return NextResponse.json({
      success: true,
      material: {
        id: material.id,
        name: material.name,
        category: material.category,
        url: publicUrl
      }
    })

  } catch (error) {
    console.error('Error uploading material:', error)
    return NextResponse.json(
      { error: 'Error uploading material' },
      { status: 500 }
    )
  }
} 