import type { GameInfo } from "../types/game"

interface GameBoardProps {
  gameInfo: GameInfo
  isShaking: boolean
}

const GameBoard = ({ gameInfo, isShaking }: GameBoardProps) => {
  const { ropePosition, team1Score, team2Score, winner } = gameInfo

  // Calculate rope position for visualization (center at position 0)
  const ropeVisualPosition = Math.max(-10, Math.min(10, ropePosition))
  const ropePercentage = ((ropeVisualPosition + 10) / 20) * 100

  const getRopeEmoji = () => {
    if (winner === 1) return "👑"
    if (winner === 2) return "👑"
    return "⚡"
  }

  return (
    <div className="glass rounded-2xl p-8 card-hover border border-white/10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-4 text-gradient-monad font-inter font-bold">Battle Arena</h2>
        <div className="flex justify-between items-center">
          <div
            className={`flex items-center space-x-3 p-4 rounded-xl border ${winner === 1 ? "victory-pulse glow-purple" : ""}`}
            style={{
              backgroundColor: "rgba(30, 144, 255, 0.1)",
              borderColor: "rgba(30, 144, 255, 0.3)",
            }}
          >
            <span className="text-3xl">🔵</span>
            <div>
              <div className="font-medium text-sm" style={{ color: "#1E90FF" }}>
                Team 1
              </div>
              <div className="font-bold text-2xl" style={{ color: "#FBFAF9" }}>
                {team1Score}
              </div>
            </div>
          </div>

          <div
            className="flex items-center space-x-2 px-6 py-3 rounded-xl border"
            style={{
              backgroundColor: "rgba(14, 16, 15, 0.5)",
              borderColor: "rgba(251, 250, 249, 0.2)",
            }}
          >
            <div className="font-bold text-lg" style={{ color: "#FBFAF9" }}>
              VS
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 rounded-xl border ${winner === 2 ? "victory-pulse glow-berry" : ""}`}
            style={{
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              borderColor: "rgba(255, 68, 68, 0.3)",
            }}
          >
            <div className="text-right">
              <div className="font-medium text-sm" style={{ color: "#FF4444" }}>
                Team 2
              </div>
              <div className="font-bold text-2xl" style={{ color: "#FBFAF9" }}>
                {team2Score}
              </div>
            </div>
            <span className="text-3xl">🔴</span>
          </div>
        </div>
      </div>

      {/* Rope Visualization */}
      <div className="relative mb-8">
        <div className="flex justify-between text-sm mb-4 px-4" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
          <span className="font-medium">Team 1 Territory</span>
          <span className="font-medium">Neutral Zone</span>
          <span className="font-medium">Team 2 Territory</span>
        </div>

        <div
          className="relative h-16 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm"
          style={{
            background: `linear-gradient(to right, 
                 rgba(131, 110, 249, 0.2) 0%, 
                 rgba(14, 16, 15, 0.3) 50%, 
                 rgba(160, 5, 93, 0.2) 100%)`,
          }}
        >
          {/* Center line */}
          <div
            className="absolute left-1/2 top-2 bottom-2 w-0.5 transform -translate-x-1/2 rounded-full"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.4)" }}
          ></div>

          {/* Grid lines */}
          <div
            className="absolute left-1/4 top-4 bottom-4 w-px"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.2)" }}
          ></div>
          <div
            className="absolute right-1/4 top-4 bottom-4 w-px"
            style={{ backgroundColor: "rgba(251, 250, 249, 0.2)" }}
          ></div>

          {/* Rope indicator */}
          <div
            className={`absolute top-1/2 w-12 h-12 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${isShaking ? "rope-shake" : ""}`}
            style={{ left: `${ropePercentage}%` }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-xl shadow-2xl border-2 relative gradient-monad-primary"
              style={{ borderColor: "rgba(251, 250, 249, 0.3)" }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(to bottom right, rgba(251, 250, 249, 0.2), transparent)" }}
              ></div>
              <span className="relative z-10">{getRopeEmoji()}</span>
            </div>
          </div>

          {/* Territory markers */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(131, 110, 249, 0.2)",
                borderColor: "rgba(131, 110, 249, 0.4)",
              }}
            >
              <span style={{ color: "#836EF9" }}>🟣</span>
            </div>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(160, 5, 93, 0.2)",
                borderColor: "rgba(160, 5, 93, 0.4)",
              }}
            >
              <span style={{ color: "#A0055D" }}>🔴</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs mt-2 px-4" style={{ color: "rgba(251, 250, 249, 0.5)" }}>
          <span>-10</span>
          <span>0</span>
          <span>+10</span>
        </div>
      </div>

      {/* Position indicator */}
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border"
          style={{
            backgroundColor: "rgba(14, 16, 15, 0.5)",
            borderColor: "rgba(251, 250, 249, 0.2)",
          }}
        >
          <span style={{ color: "rgba(251, 250, 249, 0.7)" }}>Rope Position:</span>
          <span className="font-mono font-bold text-lg" style={{ color: "#FBFAF9" }}>
            {ropePosition}
          </span>
        </div>

        {winner === 0 && (
          <p className="text-sm" style={{ color: "rgba(251, 250, 249, 0.6)" }}>
            {ropePosition > 0
              ? "🔴 Team 2 is gaining ground!"
              : ropePosition < 0
                ? "🔵 Team 1 is pulling ahead!"
                : "⚖️ Perfect balance!"}
          </p>
        )}
      </div>

      {/* Winner announcement */}
      {winner !== 0 && (
        <div className="mt-8 text-center">
          <div
            className="inline-flex items-center space-x-3 font-bold py-4 px-8 rounded-2xl shadow-2xl victory-pulse border gradient-monad-primary"
            style={{
              color: "#FBFAF9",
              borderColor: "rgba(251, 250, 249, 0.3)",
            }}
          >
            <span className="text-2xl">🎉</span>
            <span className="text-xl">Team {winner} Wins!</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard