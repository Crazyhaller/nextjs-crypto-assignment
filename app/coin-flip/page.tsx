'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { utils } from 'web3'
import Link from 'next/link'

const CoinFlipGame: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState<number>(0)
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads')
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
        const balance = await provider.getBalance(accounts[0])
        setBalance(utils.fromWei(balance.toString(), 'ether'))
      } else {
        alert('Please install MetaMask!')
      }
    }

    fetchBalance()
  }, [])

  const flipCoin = (): 'heads' | 'tails' => {
    return Math.random() < 0.5 ? 'heads' : 'tails'
  }

  const handleBet = async () => {
    if (!account) {
      alert('Please connect your wallet first!')
      return
    }

    if (betAmount <= 0 || betAmount > parseFloat(balance || '0')) {
      alert('Please enter a valid bet amount!')
      return
    }

    const side = flipCoin()
    setResult(side)

    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    if (side === selectedSide) {
      alert(`You won! You will receive double your bet.`)
      const transaction = await signer.sendTransaction({
        to: account!,
        value: ethers.parseEther((betAmount * 2).toString()),
      })
      await transaction.wait()
    } else {
      alert('You lost the bet.')
      const transaction = await signer.sendTransaction({
        to: '0x000000000000000000000000000000000000dEaD', // Example of sending to a burn address
        value: ethers.parseEther(betAmount.toString()),
      })
      await transaction.wait()
    }

    // Update the balance after the transaction
    const updatedBalance = await provider.getBalance(account!)
    setBalance(utils.fromWei(updatedBalance.toString(), 'ether'))
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 text-white p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-full shadow-lg shadow-yellow-400 hover:shadow-pink-400 hover:bg-gradient-to-r hover:from-pink-400 hover:to-yellow-400 transition duration-300 transform hover:scale-105"
      >
        Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400 neon-text text-center">
        Coin Flip Game 🎲
      </h1>
      {account ? (
        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
          <div className="text-center p-4 rounded-lg bg-black bg-opacity-70 border border-cyan-400 shadow-lg shadow-cyan-400 transform hover:scale-105 transition-transform duration-300 w-full">
            <p className="text-md text-cyan-400">Account</p>
            <p className="text-lg font-semibold text-white mt-2 break-words">
              {account}
            </p>
          </div>
          <div className="text-center p-6 rounded-lg bg-black bg-opacity-70 border border-pink-500 shadow-lg shadow-pink-500 transform hover:scale-105 transition-transform duration-300 w-full">
            <p className="text-lg text-pink-500">Balance</p>
            <p className="text-2xl font-bold text-white mt-2">{balance} ETH</p>
          </div>
          <div className="text-center p-4 w-full">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              placeholder="Enter amount to bet"
              className="w-full p-2 border rounded bg-black bg-opacity-70 text-white border-cyan-400 shadow-lg shadow-cyan-400 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center p-4 w-full flex justify-center space-x-2">
            <button
              onClick={() => setSelectedSide('heads')}
              className={`px-4 py-2 ${
                selectedSide === 'heads' ? 'bg-blue-500' : 'bg-gray-300'
              } text-white rounded-md border border-cyan-400 shadow-lg shadow-cyan-400 transform hover:scale-105 transition-transform duration-300`}
            >
              Heads
            </button>
            <button
              onClick={() => setSelectedSide('tails')}
              className={`px-4 py-2 ${
                selectedSide === 'tails' ? 'bg-blue-500' : 'bg-gray-300'
              } text-white rounded-md border border-cyan-400 shadow-lg shadow-cyan-400 transform hover:scale-105 transition-transform duration-300`}
            >
              Tails
            </button>
          </div>
          <button
            onClick={handleBet}
            className="px-4 py-2 bg-green-500 text-white rounded-md border border-cyan-400 shadow-lg shadow-cyan-400 transform hover:scale-105 transition-transform duration-300 w-full"
          >
            Flip Coin
          </button>
          {result && (
            <div className="mt-4 text-center">
              <p>The coin landed on: {result}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-lg text-cyan-400 text-center">
          Please connect your wallet to play the game.
        </p>
      )}
    </div>
  )
}

export default CoinFlipGame
