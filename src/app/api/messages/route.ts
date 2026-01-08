import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

// GET - Fetch messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // For pagination

    const messages = await prisma.message.findMany({
      take: limit,
      ...(before && {
        where: {
          createdAt: {
            lt: new Date(before)
          }
        }
      }),
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            isFounder: true,
            profileImage: true
          }
        }
      }
    })

    return NextResponse.json({
      messages: messages.reverse(), // Show oldest first
      success: true
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const currentUser = JSON.parse(userCookie.value)
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: currentUser.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            isFounder: true,
            profileImage: true
          }
        }
      }
    })

    return NextResponse.json({
      message,
      success: true
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
