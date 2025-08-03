"use client"

import { BarChart3, Target, Trophy, RotateCcw, Loader2 } from "lucide-react"
import type { GameInfo, TeamStats, GamePrediction } from "../types/game"

interface GameStatsProps {
  gameInfo: GameInfo
  team1Stats: TeamStats
  team2Stats: TeamStats
  prediction: GamePrediction
  isOwner: boolean
  onReset: () => void
  isResetting: boolean
}

const GameStats = ({ gameInfo, team1Stats, team2Stats, prediction, isOwner, onReset, isResetting }: GameStatsProps) => {
  const { maxScoreDifference, totalPulls, gamesPlayed } = gameInfo

  const getProgressPercentage = (score: number) => {
    return Math.min((score / maxScoreDifference) * 100, 100)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Team Statistics */}
      <div className="glass rounded-2xl p-8 card-hover border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: "#FBFAF9" }}>
          <BarChart3 className="w-6 h-6 mr-3" style={{ color: "#836EF9" }} />
          Team Statistics
        </h3>

        <div className="space-y-6">
          {/* Team 1 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1E90FF" }}></div>
                <span className="font-semibold text-lg" style={{ color: "#1E90FF" }}>
                  Team 1
                </span>
                {team1Stats.isWinning && (
                  <span
                    className="text-xs px-2 py-1 rounded-full border font-medium"
                    style={{
                      backgroundColor: "rgba(30, 144, 255, 0.2)",
                      color: "#1E90FF",
                      borderColor: "rgba(30, 144, 255, 0.3)",
                    }}
                  >
                    Leading
                  </span>
                )}
              </div>
              <span className="font-bold text-xl" style={{ color: "#FBFAF9" }}>
                {team1Stats.score}
              </span>
            </div>
            <div
              className="relative w-full rounded-full h-4 overflow-hidden"
              style={{ backgroundColor: "rgba(14, 16, 15, 0.5)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{
                  width: `${getProgressPercentage(team1Stats.score)}%`,
                  background: "linear-gradient(to right, #1E90FF, #4FC3F7)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(131, 110, 249, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              <span>Progress to victory</span>
              <span>Advantage: +{team1Stats.scoreAdvantage}</span>
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF4444" }}></div>
                <span className="font-semibold text-lg" style={{ color: "#FF4444" }}>
                  Team 2
                </span>
                {team2Stats.isWinning && (
                  <span
                    className="text-xs px-2 py-1 rounded-full border font-medium"
                    style={{
                      backgroundColor: "rgba(255, 68, 68, 0.2)",
                      color: "#FF4444",
                      borderColor: "rgba(255, 68, 68, 0.3)",
                    }}
                  >
                    Leading
                  </span>
                )}
              </div>
              <span className="font-bold text-xl" style={{ color: "#FBFAF9" }}>
                {team2Stats.score}
              </span>
            </div>
            <div
              className="relative w-full rounded-full h-4 overflow-hidden"
              style={{ backgroundColor: "rgba(14, 16, 15, 0.5)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{
                  width: `${getProgressPercentage(team2Stats.score)}%`,
                  background: "linear-gradient(to right, #FF4444, #FF6B6B)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, rgba(160, 5, 93, 0.3), transparent)" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              <span>Progress to victory</span>
              <span>Advantage: +{team2Stats.scoreAdvantage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Info & Controls */}
      <div className="glass rounded-2xl p-8 card-hover border border-white/10">
        <h3 className="text-2xl font-bold mb-6 flex items-center" style={{ color: "#FBFAF9" }}>
          <Target className="w-6 h-6 mr-3" style={{ color: "#A0055D" }} />
          Game Information
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
              }}
            >
              <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
                Win Condition
              </div>
              <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                {maxScoreDifference} points
              </div>
            </div>
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: "rgba(14, 16, 15, 0.5)",
                borderColor: "rgba(251, 250, 249, 0.2)",
              }}
            >
              <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
                Total Pulls
              </div>
              <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
                {totalPulls}
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <div className="text-sm mb-1" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
              Games Played
            </div>
            <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
              {gamesPlayed}
            </div>
          </div>

          {/* AI Prediction */}
          {prediction.predictedWinner > 0 && (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "linear-gradient(135deg, rgba(131, 110, 249, 0.2), rgba(160, 5, 93, 0.2))",
                borderColor: "rgba(131, 110, 249, 0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold" style={{ color: "#836EF9" }}>
                    🔮 AI Prediction
                  </span>
                </div>
                <span className="text-sm font-medium" style={{ color: "#FBFAF9" }}>
                  {prediction.confidence}% confidence
                </span>
              </div>
              <div className="font-bold" style={{ color: "#FBFAF9" }}>
                Team {prediction.predictedWinner} is favored to win
              </div>
            </div>
          )}

          {/* Reset Button for Owner */}
          {isOwner && (
            <div className="space-y-3">
              {gameInfo.winner > 0 && (
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30">
                  <div className="text-lg font-bold text-gradient-primary mb-1">
                    🎉 Game Finished!
                  </div>
                  <div className="text-sm text-gray-300">
                    Team {gameInfo.winner} Wins! Reset to start a new game.
                  </div>
                </div>
              )}
              <button
                onClick={onReset}
                disabled={isResetting}
                className="w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-w3gg btn-primary-w3gg sparkle"
              >
                {isResetting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting Game...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset Game</span>
                    <Trophy className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameStats