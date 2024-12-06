import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, Lightbulb } from "lucide-react"

interface StatusCardProps {
  title: string
  description: string
  content: string[]
  type?: 'activities' | 'deadlines' | 'suggestions'
  className?: string
}

const cardStyles = {
  activities: {
    background: "bg-gradient-to-br from-blue-400/80 to-blue-600/80",
    icon: Activity,
    iconColor: "text-blue-100",
    hover: "hover:from-blue-400/90 hover:to-blue-600/90",
    ring: "ring-blue-400/20"
  },
  deadlines: {
    background: "bg-gradient-to-br from-purple-400/80 to-purple-600/80",
    icon: Calendar,
    iconColor: "text-purple-100",
    hover: "hover:from-purple-400/90 hover:to-purple-600/90",
    ring: "ring-purple-400/20"
  },
  suggestions: {
    background: "bg-gradient-to-br from-amber-400/80 to-amber-600/80",
    icon: Lightbulb,
    iconColor: "text-amber-100",
    hover: "hover:from-amber-400/90 hover:to-amber-600/90",
    ring: "ring-amber-400/20"
  }
}

export function StatusCard({
  title,
  description,
  content,
  type = 'activities',
  className,
}: StatusCardProps) {
  const style = cardStyles[type]
  const Icon = style.icon

  return (
    <Card className={`
      relative overflow-hidden transition-all duration-300 
      ${style.background} ${style.hover}
      shadow-lg ring-1 ${style.ring}
      backdrop-blur-xl bg-white/5
      group
    `}>
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <CardHeader className="relative pb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-black/10 backdrop-blur-sm ${style.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium text-white/90">
              {title}
            </CardTitle>
            <p className="text-sm text-white/70">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-2">
          {content.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-2 text-sm text-white/80 bg-black/10 backdrop-blur-sm rounded-lg p-2 transition-all duration-300 hover:bg-black/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Interactive shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
      </div>
    </Card>
  )
}