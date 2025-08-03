import { ConnectButton } from "@rainbow-me/rainbowkit"

const Header = () => {
  return (
    <header className="glass-w3gg sticky top-0 z-50 py-4 border-b border-yellow-400/20 backdrop-blur-xl">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>
            TugWar
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Discord Button */}
          <a 
            href="https://discord.com/invite/yrWQeS8GBa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-w3gg btn-secondary-w3gg text-sm px-4 py-2"
          >
            Join Discord
          </a>
          
          {/* Connect Button */}
          <ConnectButton>
          </ConnectButton>
        </div>
      </div>
    </header>
  )
}

export default Header