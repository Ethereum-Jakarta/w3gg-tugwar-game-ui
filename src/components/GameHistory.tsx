"use client"

import { useState } from "react"
import { Clock, Trophy, Users, RotateCcw, ChevronDown, ChevronRight } from "lucide-react"
import type { GameEvent } from "../types/game"

interface GameHistoryProps {
  events: GameEvent[]
}

const GameHistory = ({ events }: GameHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pull":
        return <Users className="w-4 h-4" />
      case "win":
        return <Trophy className="w-4 h-4" style={{ color: "#836EF9" }} />
      case "reset":
        return <RotateCcw className="w-4 h-4" style={{ color: "#A0055D" }} />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getEventMessage = (event: GameEvent) => {
    switch (event.type) {
      case "pull":
        return `Team ${event.team} pulled the rope`
      case "win":
        return `Team ${event.team} won the game!`
      case "reset":
        return `Game was reset`
      default:
        return "Unknown event"
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "pull":
        return {
          backgroundColor: "rgba(131, 110, 249, 0.1)",
          borderColor: "rgba(131, 110, 249, 0.2)",
          hoverBg: "rgba(131, 110, 249, 0.2)",
        }
      case "win":
        return {
          backgroundColor: "rgba(131, 110, 249, 0.15)",
          borderColor: "rgba(131, 110, 249, 0.3)",
          hoverBg: "rgba(131, 110, 249, 0.25)",
        }
      case "reset":
        return {
          backgroundColor: "rgba(160, 5, 93, 0.1)",
          borderColor: "rgba(160, 5, 93, 0.2)",
          hoverBg: "rgba(160, 5, 93, 0.2)",
        }
      default:
        return {
          backgroundColor: "rgba(14, 16, 15, 0.3)",
          borderColor: "rgba(251, 250, 249, 0.1)",
          hoverBg: "rgba(14, 16, 15, 0.5)",
        }
    }
  }

  const getTeamColor = (team?: number) => {
    if (team === 1) return "#1E90FF"
    if (team === 2) return "#FF4444"
    return "rgba(251, 250, 249, 0.6)"
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      <button
        className="w-full flex items-center justify-between hover:bg-white/5 rounded-xl p-3 -m-3 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-2xl font-bold flex items-center" style={{ color: "#FBFAF9" }}>
          <Clock className="w-6 h-6 mr-3" style={{ color: "#836EF9" }} />
          Game History
          <span
            className="ml-3 text-lg px-3 py-1 rounded-full border font-medium"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              color: "#FBFAF9",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            {events.length}
          </span>
        </h3>
        <div className="transition-transform duration-200" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 float-animation">🎮</div>
              <h4 className="text-xl font-semibold mb-2" style={{ color: "#FBFAF9" }}>
                No events yet
              </h4>
              <p style={{ color: "rgba(251, 250, 249, 0.6)" }}>Start pulling to see the battle unfold!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {events
                .slice()
                .reverse()
                .map((event, index) => {
                  const colors = getEventColor(event.type)
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01]"
                      style={{
                        backgroundColor: colors.backgroundColor,
                        borderColor: colors.borderColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hoverBg
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.backgroundColor
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: "rgba(14, 16, 15, 0.5)",
                          borderColor: "rgba(251, 250, 249, 0.2)",
                        }}
                      >
                        {getEventIcon(event.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ color: getTeamColor(event.team) }}>
                          {getEventMessage(event)}
                        </p>
                        <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {event.player && (
                        <div className="flex-shrink-0">
                          <div
                            className="text-xs font-mono px-2 py-1 rounded border"
                            style={{
                              backgroundColor: "rgba(14, 16, 15, 0.5)",
                              color: "rgba(251, 250, 249, 0.6)",
                              borderColor: "rgba(251, 250, 249, 0.2)",
                            }}
                          >
                            {event.player.slice(0, 6)}...{event.player.slice(-4)}
                          </div>
                        </div>
                      )}

                      {event.type === "win" && (
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🏆</span>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GameHistory