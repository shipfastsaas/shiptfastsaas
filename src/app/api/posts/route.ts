import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/Post'

// Indiquer que cette route est dynamique
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const body = await req.json()

    const post = await Post.create({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      status: body.status || 'draft',
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    const posts = await Post.find({}).sort({ createdAt: -1 })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
