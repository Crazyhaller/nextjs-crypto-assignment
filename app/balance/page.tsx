'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { utils } from 'web3'
import Link from 'next/link'

const BalancePage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

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

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 text-white p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-full shadow-lg shadow-yellow-400 hover:shadow-pink-400 hover:bg-gradient-to-r hover:from-pink-400 hover:to-yellow-400 transition duration-300 transform hover:scale-105"
      >
        Back to Home
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400 neon-text text-center">
        Your Balance 🤖
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
        </div>
      ) : (
        <p className="text-lg text-cyan-400 text-center">
          Please connect your wallet to see the balance.
        </p>
      )}
    </div>
  )
}

export default BalancePage
