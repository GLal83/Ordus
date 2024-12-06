// src/components/dashboard/TaskList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface Task {
  id: string
  title: string
  dueDate: Date
  status: string
  priority: 'low' | 'medium' | 'high'
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/upcoming')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading tasks...</div>

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-sm ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}