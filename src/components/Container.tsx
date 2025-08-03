"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { TUGWAR_ABI, TUGWAR_CONTRACT_ADDRESS } from "../constants"
import { waitForTransactionReceipt } from "@wagmi/core"
import { config } from "../App"
import GameBoard from "./GameBoard"
import GameControls from "./GameControls"
import GameStats from "./GameStats"
import GameHistory from "./GameHistory"
import type { GameInfo, TeamStats, GamePrediction, GameEvent } from "../types/game"

const tugwarContract = {
  address: TUGWAR_CONTRACT_ADDRESS as `0x${string}`,
  abi: TUGWAR_ABI,
}

const Container = () => {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([])

  // Read game information
  const { data: gameInfoData, refetch: refetchGameInfo } = useReadContract({
    ...tugwarContract,
    functionName: "getGameInfo",
    query: {
      enabled: isConnected,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  // Read team 1 stats
  const { data: team1StatsData, refetch: refetchTeam1Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [1],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read team 2 stats
  const { data: team2StatsData, refetch: refetchTeam2Stats } = useReadContract({
    ...tugwarContract,
    functionName: "getTeamStats",
    args: [2],
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read prediction
  const { data: predictionData, refetch: refetchPrediction } = useReadContract({
    ...tugwarContract,
    functionName: "getPrediction",
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  })

  // Read owner
  const { data: ownerData } = useReadContract({
    ...tugwarContract,
    functionName: "owner",
    query: {
      enabled: isConnected,
    },
  })

  // Process data with proper type assertions and checks
  const gameInfo: GameInfo =
    gameInfoData && Array.isArray(gameInfoData)
      ? {
          ropePosition: Number(gameInfoData[0]),
          team1Score: Number(gameInfoData[1]),
          team2Score: Number(gameInfoData[2]),
          maxScoreDifference: Number(gameInfoData[3]),
          winner: Number(gameInfoData[4]),
          totalPulls: Number(gameInfoData[5]),
          gamesPlayed: Number(gameInfoData[6]),
        }
      : {
          ropePosition: 0,
          team1Score: 0,
          team2Score: 0,
          maxScoreDifference: 5,
          winner: 0,
          totalPulls: 0,
          gamesPlayed: 0,
        }

  const team1Stats: TeamStats =
    team1StatsData && Array.isArray(team1StatsData)
      ? {
          score: Number(team1StatsData[0]),
          isWinning: Boolean(team1StatsData[1]),
          scoreAdvantage: Number(team1StatsData[2]),
        }
      : { score: 0, isWinning: false, scoreAdvantage: 0 }

  const team2Stats: TeamStats =
    team2StatsData && Array.isArray(team2StatsData)
      ? {
          score: Number(team2StatsData[0]),
          isWinning: Boolean(team2StatsData[1]),
          scoreAdvantage: Number(team2StatsData[2]),
        }
      : { score: 0, isWinning: false, scoreAdvantage: 0 }

  const prediction: GamePrediction =
    predictionData && Array.isArray(predictionData)
      ? {
          predictedWinner: Number(predictionData[0]),
          confidence: Number(predictionData[1]),
        }
      : { predictedWinner: 0, confidence: 0 }

  const isOwner = address && ownerData && address.toLowerCase() === (ownerData as string).toLowerCase()

  // Watch for contract events
  useWatchContractEvent({
    ...tugwarContract,
    eventName: "PullExecuted",
    onLogs(logs) {
      console.log("Pull executed:", logs)
      triggerShake()
      refetchAll()

      // Add event to history
      const log = logs[0]
      if (log && "args" in log && log.args) {
        const args = log.args as {
          player: string
          isTeam1: boolean
          newRopePosition: number
          team1Score: number
          team2Score: number
        }

        const { player, isTeam1, team1Score, team2Score } = args
        const newEvent: GameEvent = {
          type: "pull",
          player: player,
          team: isTeam1 ? 1 : 2,
          timestamp: Date.now(),
        }
        setGameEvents((prev) => [...prev, newEvent])

        // Show toast notification
        toast.success(`${isTeam1 ? "Team 1" : "Team 2"} pulled! Score: ${team1Score} - ${team2Score}`, {
          style: {
            background: "rgba(32, 0, 82, 0.95)",
            color: "#FBFAF9",
            border: "1px solid rgba(131, 110, 249, 0.3)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        })
      }
    },
  })

  useWatchContractEvent({
    ...tugwarContract,
    eventName: "GameWon",
    onLogs(logs) {
      console.log("Game won:", logs)
      refetchAll()

      // Add event to history
      const log = logs[0]
      if (log && "args" in log && log.args) {
        const args = log.args as {
          winningTeam: number
          finalScore1: number
          finalScore2: number
        }

        const { winningTeam, finalScore1, finalScore2 } = args
        const newEvent: GameEvent = {
          type: "win",
          team: Number(winningTeam),
          timestamp: Date.now(),
        }
        setGameEvents((prev) => [...prev, newEvent])

        // Show victory toast
        toast.success(`🎉 Team ${winningTeam} Wins! Final Score: ${finalScore1} - ${finalScore2}`, {
          duration: 5000,
          style: {
            background: "rgba(32, 0, 82, 0.95)",
            color: "#FBFAF9",
            border: "1px solid rgba(131, 110, 249, 0.5)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
        })
      }
    },
  })

  useWatchContractEvent({
    ...tugwarContract,
    eventName: "GameReset",
    onLogs(logs) {
      console.log("Game reset:", logs)
      refetchAll()

      // Add event to history and clear previous events
      const newEvent: GameEvent = {
        type: "reset",
        timestamp: Date.now(),
      }
      setGameEvents([newEvent]) // Reset history on game reset

      toast.success("Game has been reset!", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    },
  })

  // Trigger rope shake animation
  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 400)
  }

  // Refetch all data
  const refetchAll = () => {
    refetchGameInfo()
    refetchTeam1Stats()
    refetchTeam2Stats()
    refetchPrediction()
  }

  // Handle pull action
  const handlePull = async (isTeam1: boolean) => {
    if (!isConnected || gameInfo.winner !== 0) return

    setIsLoading(true)

    toast.loading(`Team ${isTeam1 ? "1" : "2"} is pulling...`, {
      style: {
        background: "rgba(32, 0, 82, 0.95)",
        color: "#FBFAF9",
        border: "1px solid rgba(131, 110, 249, 0.3)",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    })

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "pull",
        args: [isTeam1],
        account: address as `0x${string}`,
      })

      toast.dismiss()
      toast.loading("Confirming pull...", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(131, 110, 249, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })

      const resultTransaction = await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      })

      console.log("Pull transaction confirmed:", resultTransaction)
      toast.dismiss()
      // Success toast will be handled by event listener
    } catch (error) {
      console.error("Pull failed:", error)
      toast.dismiss()
      toast.error("Pull failed. Please try again.", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.5)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle reset game (owner only)
  const handleReset = async () => {
    if (!isConnected || !isOwner) return

    setIsResetting(true)

    toast.loading("Resetting game...", {
      style: {
        background: "rgba(32, 0, 82, 0.95)",
        color: "#FBFAF9",
        border: "1px solid rgba(131, 110, 249, 0.3)",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    })

    try {
      const result = await writeContractAsync({
        ...tugwarContract,
        functionName: "reSet",
        args: [5], // Reset with default max score difference of 5
        account: address as `0x${string}`,
      })

      toast.dismiss()
      toast.loading("Confirming reset...", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(131, 110, 249, 0.3)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      })

      toast.dismiss()
      // Success toast will be handled by event listener
    } catch (error) {
      console.error("Reset failed:", error)
      toast.dismiss()
      toast.error("Reset failed. Please try again.", {
        style: {
          background: "rgba(32, 0, 82, 0.95)",
          color: "#FBFAF9",
          border: "1px solid rgba(160, 5, 93, 0.5)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {isConnected ? (
          <div className="space-y-8">
            <GameBoard gameInfo={gameInfo} isShaking={isShaking} />
            <GameControls
              onPull={handlePull}
              isConnected={isConnected}
              winner={gameInfo.winner}
              isLoading={isLoading}
            />
            <GameStats
              gameInfo={gameInfo}
              team1Stats={team1Stats}
              team2Stats={team2Stats}
              prediction={prediction}
              isOwner={Boolean(isOwner)}
              onReset={handleReset}
              isResetting={isResetting}
            />
            <GameHistory events={gameEvents} />
          </div>
        ) : (
          <div className="relative min-h-screen overflow-hidden particle-bg">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-yellow-600/20"></div>
            <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl float-slow"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl float-medium"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-400/5 to-transparent rounded-full"></div>
            
            {/* Live Badge */}
            <div className="absolute top-8 left-8 z-20 float-fast">
              <div className="live-badge sparkle">
                🔥&nbsp;&nbsp;MONAD TESTNET LIVE!
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
              <div className="text-center max-w-5xl mx-auto px-8 py-20">
              {/* Main Title */}
              <h1 className="hero-title text-gradient-primary mb-6 fade-in-up">
                <span className="block sm:inline">PULL.&nbsp;BATTLE.</span>
                <span className="block sm:inline">&nbsp;WIN.</span>
                <br />
                <span className="text-white text-reveal">TUGWAR.</span>
              </h1>
              
              {/* Subtitle */}
              <p className="hero-subtitle text-gray-300 mb-12 max-w-3xl mx-auto fade-in-up-delay-1">
                The ultimate blockchain tug of war battle on Monad testnet. 
                Choose your side, pull the rope, and claim victory in the most epic Web3 gaming experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 fade-in-up-delay-2">
                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button 
                                onClick={openConnectModal} 
                                className="btn-w3gg btn-primary-w3gg btn-magnetic text-lg px-8 py-4 sparkle"
                              >
                                Connect Wallet & Play Now
                              </button>
                            );
                          }

                          return (
                            <button 
                              onClick={openAccountModal} 
                              className="btn-w3gg btn-primary-w3gg btn-magnetic text-lg px-8 py-4 sparkle"
                            >
                              {account.displayName}
                            </button>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
                <a 
                  href="https://discord.com/invite/yrWQeS8GBa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-w3gg btn-secondary-w3gg interactive-hover text-lg px-8 py-4"
                >
                  Join Our Discord
                </a>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                {/* Play to Earn */}
                <div className="glass-card p-8 text-center glow-hover fade-in-up-delay-1">
                  <div className="text-5xl mb-4 float-fast">⚡</div>
                  <h3 className="text-xl font-bold text-gradient-primary mb-3">PLAY TO EARN</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Pull the rope, win battles, and earn rewards on the blockchain. Every move counts in this epic struggle.
                  </p>
                </div>

                {/* Biggest Web3 Gaming */}
                <div className="glass-card p-8 text-center glow-hover fade-in-up-delay-2">
                  <div className="text-5xl mb-4 float-medium">🏆</div>
                  <h3 className="text-xl font-bold text-gradient-primary mb-3">EPIC BATTLES</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Join the most intense blockchain gaming experience. Team up and dominate the competition.
                  </p>
                </div>

                {/* Monad Powered */}
                <div className="glass-card p-8 text-center glow-hover fade-in-up-delay-3">
                  <div className="text-5xl mb-4 float-slow">🚀</div>
                  <h3 className="text-xl font-bold text-gradient-primary mb-3">MONAD POWERED</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Built on Monad testnet for lightning-fast transactions and seamless gaming experience.
                  </p>
                </div>
              </div>

              {/* Team Selection Preview */}
              <div className="mt-16 fade-in-up-delay-3">
                <h3 className="text-2xl font-bold mb-8 text-gradient-primary">CHOOSE YOUR SIDE</h3>
                <div className="flex justify-center items-center space-x-12">
                  <div className="gradient-border glass-card p-6 scale-hover interactive-hover cursor-pointer border-2 border-blue-500/30 hover:border-blue-400 sparkle">
                    <div className="text-4xl mb-3 float-medium">🔵</div>
                    <div className="text-blue-400 font-bold text-lg">TEAM BLUE</div>
                    <div className="text-sm text-gray-400 mt-2">The Strategists</div>
                  </div>
                  
                  <div className="text-3xl font-bold text-gradient-primary animate-pulse float-fast">VS</div>
                  
                  <div className="gradient-border glass-card p-6 scale-hover interactive-hover cursor-pointer border-2 border-red-500/30 hover:border-red-400 sparkle">
                    <div className="text-4xl mb-3 float-medium">🔴</div>
                    <div className="text-red-400 font-bold text-lg">TEAM RED</div>
                    <div className="text-sm text-gray-400 mt-2">The Warriors</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Container