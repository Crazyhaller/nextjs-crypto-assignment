'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { utils } from 'web3'
import Link from 'next/link'

const Home: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const connectWallet = async () => {
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

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white p-4"
      style={{
        backgroundImage: `url(/assets/backgrounds/homeBg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-500 neon-text bg-black bg-opacity-40 p-4 rounded-lg shadow-lg shadow-cyan-500 text-center">
        Welcome Crypto Enthusiasts🚀
      </h1>
      <button
        onClick={connectWallet}
        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full mb-4 shadow-lg shadow-pink-500 hover:shadow-purple-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition duration-300 transform hover:scale-105 text-center"
      >
        {account ? 'Connected' : 'Connect Wallet'}
      </button>
      {account && (
        <div className="mt-5 flex flex-col space-y-4 w-full md:w-auto">
          <Link
            href="/balance"
            className="w-full md:w-auto text-white bg-gradient-to-r from-red-700 to-black px-6 py-3 rounded-full border border-cyan-700 shadow-lg shadow-cyan-500 hover:shadow-yellow-500 hover:bg-gradient-to-r hover:from-yellow-700 hover:to-yellow-500 transition duration-300 transform hover:scale-105 text-center"
          >
            Go to Balance Page
          </Link>
          <Link
            href="/coin-flip"
            className="w-full md:w-auto text-white bg-gradient-to-r from-green-700 to-blue-700 px-6 py-3 rounded-full border border-blue-300 shadow-lg shadow-green-500 hover:shadow-pink-500 hover:bg-gradient-to-r hover:from-pink-700 hover:to-pink-500 transition duration-300 transform hover:scale-105 text-center"
          >
            Go to Coin Flip Game
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home
