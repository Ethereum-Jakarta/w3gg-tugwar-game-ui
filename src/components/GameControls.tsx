"use client"

import { useState } from "react"
import { Users, Zap, Loader2 } from "lucide-react"

interface GameControlsProps {
  onPull: (isTeam1: boolean) => void
  isConnected: boolean
  winner: number
  isLoading: boolean
}

const GameControls = ({ onPull, isConnected, winner, isLoading }: GameControlsProps) => {
  const [lastPull, setLastPull] = useState<number | null>(null)

  const handlePull = (isTeam1: boolean) => {
    if (!isConnected || winner !== 0 || isLoading) return

    onPull(isTeam1)
    setLastPull(isTeam1 ? 1 : 2)

    // Reset last pull indicator after 2 seconds
    setTimeout(() => setLastPull(null), 2000)
  }

  const getButtonClass = (isTeam1: boolean) => {
    const baseClass =
      "group relative flex-1 py-8 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform border-2 overflow-hidden"
    const teamNumber = isTeam1 ? 1 : 2

    if (!isConnected || winner !== 0) {
      return `${baseClass} cursor-not-allowed border-opacity-30`
    }

    if (isLoading) {
      return `${baseClass} cursor-not-allowed opacity-50`
    }

    const recentPull = lastPull === teamNumber ? "ring-4 scale-105" : ""
    const hoverEffect = "hover:scale-105 hover:shadow-2xl active:scale-95"

    return `${baseClass} ${recentPull} ${hoverEffect} btn-primary`
  }

  const getButtonStyle = (isTeam1: boolean) => {
    if (!isConnected || winner !== 0) {
      return {
        backgroundColor: "rgba(14, 16, 15, 0.5)",
        borderColor: "rgba(251, 250, 249, 0.2)",
        color: "rgba(251, 250, 249, 0.5)",
      }
    }

    if (isLoading) {
      return isTeam1
        ? {
            backgroundColor: "rgba(30, 144, 255, 0.5)",
            borderColor: "rgba(30, 144, 255, 0.3)",
            color: "#FBFAF9",
          }
        : {
            backgroundColor: "rgba(255, 68, 68, 0.5)",
            borderColor: "rgba(255, 68, 68, 0.3)",
            color: "#FBFAF9",
          }
    }

    return isTeam1
      ? {
          background: "linear-gradient(135deg, #1E90FF 0%, #4FC3F7 100%)",
          borderColor: "rgba(30, 144, 255, 0.5)",
          color: "#FBFAF9",
        }
      : {
          background: "linear-gradient(135deg, #FF4444 0%, #FF6B6B 100%)",
          borderColor: "rgba(255, 68, 68, 0.5)",
          color: "#FBFAF9",
        }
  }

  const getRingStyle = (isTeam1: boolean) => {
    if (lastPull === (isTeam1 ? 1 : 2)) {
      return { ringColor: isTeam1 ? "#1E90FF" : "#FF4444" }
    }
    return {}
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2" style={{ color: "#FBFAF9" }}>
          Choose Your Side
        </h3>
        <p style={{ color: "rgba(251, 250, 249, 0.7)" }}>Click to pull the rope for your team</p>
      </div>

      {!isConnected && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)",
            }}
          >
            <span style={{ color: "#836EF9" }}>⚠️</span>
            <span className="text-sm font-medium" style={{ color: "#836EF9" }}>
              Connect your wallet to play!
            </span>
          </div>
        </div>
      )}

      {winner !== 0 && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: "rgba(131, 110, 249, 0.1)",
              borderColor: "rgba(131, 110, 249, 0.3)",
            }}
          >
            <span style={{ color: "#836EF9" }}>🎉</span>
            <span className="text-sm font-medium" style={{ color: "#836EF9" }}>
              Game Over! Reset to play again.
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-6">
        <button
          onClick={() => handlePull(true)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(true)}
          style={{
            ...getButtonStyle(true),
            ...getRingStyle(true),
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to right, rgba(131, 110, 249, 0.2), transparent)" }}
          ></div>
          <div className="relative flex items-center justify-center space-x-3">
            <Users className="w-6 h-6" />
            <div className="text-center">
              <div className="text-xl font-bold">Pull for Team 1</div>
              <div className="text-sm opacity-90 flex items-center justify-center space-x-1">
                <span>🔵</span>
                <span>Blue Team</span>
              </div>
            </div>
            <Zap className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => handlePull(false)}
          disabled={!isConnected || winner !== 0 || isLoading}
          className={getButtonClass(false)}
          style={{
            ...getButtonStyle(false),
            ...getRingStyle(false),
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to left, rgba(160, 5, 93, 0.2), transparent)" }}
          ></div>
          <div className="relative flex items-center justify-center space-x-3">
            <Zap className="w-5 h-5" />
            <div className="text-center">
              <div className="text-xl font-bold">Pull for Team 2</div>
              <div className="text-sm opacity-90 flex items-center justify-center space-x-1">
                <span>🔴</span>
                <span>Red Team</span>
              </div>
            </div>
            <Users className="w-6 h-6" />
          </div>
        </button>
      </div>

      {isLoading && (
        <div className="text-center mt-6">
          <div
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-xl border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#836EF9" }} />
            <span className="font-medium" style={{ color: "#FBFAF9" }}>
              Processing pull...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameControls