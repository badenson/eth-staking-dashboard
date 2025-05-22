import React from 'react';
import './index.css';

// If using Vite, also install recharts: npm install recharts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [network, setNetwork] = React.useState('sepolia');
  const [isLoading, setIsLoading] = React.useState(false);

  // Replace with your testnet address or connect wallet logic
  const [userAddress] = React.useState('0xYourTestnetAddress');
  const [userStake, setUserStake] = React.useState('0');
  const [stakeAmount, setStakeAmount] = React.useState('');
  const [unstakeAmount, setUnstakeAmount] = React.useState('');
  const [txStatus, setTxStatus] = React.useState('');

  // Mock data for charts and tables
  const validatorData = {
    totalValidators: 842,
    activeValidators: 836,
    pendingValidators: 4,
    exitingValidators: 2,
    totalStaked: 26912.0,
    averageAPR: 3.74,
    networkParticipation: 99.2,
    lastReward: 0.00042,
    nextReward: '~6h 12m',
    uptime: 99.98,
  };

  const rewardData = [
    { name: 'May 16', value: 0.00037 },
    { name: 'May 17', value: 0.00039 },
    { name: 'May 18', value: 0.00038 },
    { name: 'May 19', value: 0.00040 },
    { name: 'May 20', value: 0.00041 },
    { name: 'May 21', value: 0.00039 },
    { name: 'May 22', value: 0.00042 },
  ];

  const networkData = [
    { name: 'May 16', value: 99.1 },
    { name: 'May 17', value: 99.3 },
    { name: 'May 18', value: 99.2 },
    { name: 'May 19', value: 99.0 },
    { name: 'May 20', value: 99.4 },
    { name: 'May 21', value: 99.3 },
    { name: 'May 22', value: 99.2 },
  ];

  // API calls
  async function stakeETH(amount) {
    setTxStatus('Staking...');
    try {
      const res = await fetch('http://localhost:4000/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      setTxStatus(data.success ? `Staked! Tx: ${data.txHash}` : `Error: ${data.error}`);
      if (data.success) fetchUserStake();
    } catch (err) {
      setTxStatus('Error: Could not connect to backend');
    }
  }

  async function unstakeETH(amount) {
    setTxStatus('Unstaking...');
    try {
      const res = await fetch('http://localhost:4000/api/unstake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      setTxStatus(data.success ? `Unstaked! Tx: ${data.txHash}` : `Error: ${data.error}`);
      if (data.success) fetchUserStake();
    } catch (err) {
      setTxStatus('Error: Could not connect to backend');
    }
  }

  async function fetchUserStake() {
    if (!userAddress) return;
    try {
      const res = await fetch(`http://localhost:4000/api/stakes?address=${userAddress}`);
      const data = await res.json();
      if (data.success) setUserStake(data.data);
    } catch (err) {
      setUserStake('0');
    }
  }

  React.useEffect(() => {
    fetchUserStake();
    // eslint-disable-next-line
  }, [userAddress]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-ethereum text-xl"></i>
            </div>
            <h1 className="text-xl font-bold">ETH Staking Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={network}
              onChange={e => setNetwork(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
            >
              <option value="mainnet">Mainnet</option>
              <option value="goerli">Goerli</option>
              <option value="sepolia">Sepolia</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-300 mb-6">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'validators' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('validators')}
              >
                Validators
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'rewards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('rewards')}
              >
                Rewards
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>

            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stake/Unstake Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row md:items-center md:space-x-6">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Your Staked Balance</div>
                    <div className="text-2xl font-bold mb-2">{userStake} ETH</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Amount to stake"
                        value={stakeAmount}
                        onChange={e => setStakeAmount(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => stakeETH(stakeAmount)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Stake
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Amount to unstake"
                        value={unstakeAmount}
                        onChange={e => setUnstakeAmount(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => unstakeETH(unstakeAmount)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Unstake
                      </button>
                    </div>
                  </div>
                  {txStatus && <div className="mt-2 text-sm text-blue-700">{txStatus}</div>}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Total Validators</p>
                        <h3 className="text-2xl font-bold">{validatorData.totalValidators}</h3>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                        <i className="fas fa-server"></i>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Total ETH Staked</p>
                        <h3 className="text-2xl font-bold">{validatorData.totalStaked.toLocaleString()} ETH</h3>
                      </div>
                      <div className="p-2 bg-green-100 rounded-md text-green-600">
                        <i className="fas fa-coins"></i>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Average APR</p>
                        <h3 className="text-2xl font-bold">{validatorData.averageAPR}%</h3>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Network Participation</p>
                        <h3 className="text-2xl font-bold">{validatorData.networkParticipation}%</h3>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-md text-yellow-600">
                        <i className="fas fa-signal"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Daily Rewards (ETH)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rewardData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={value => value.toFixed(5)} domain={['auto', 'auto']} />
                          <Tooltip formatter={value => value.toFixed(5) + ' ETH'} />
                          <Line type="monotone" dataKey="value" stroke="#0946CE" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Network Participation (%)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={networkData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[98, 100]} />
                          <Tooltip formatter={value => value.toFixed(1) + '%'} />
                          <Line type="monotone" dataKey="value" stroke="#5A973C" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* You can add Validators, Rewards, and Settings tab content here as needed */}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2025 ETH Staking Dashboard. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;