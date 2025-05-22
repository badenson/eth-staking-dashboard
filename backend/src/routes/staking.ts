import { Router } from 'express';
import { ethers } from 'ethers';

const router = Router();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const STAKING_CONTRACT_ADDRESS = process.env.STAKING_CONTRACT_ADDRESS!;
const STAKING_CONTRACT_ABI = [
  "function stake() payable",
  "function unstake(uint256 amount)",
  "function getStakes(address) view returns (uint256)"
];

const contract = new ethers.Contract(
  STAKING_CONTRACT_ADDRESS,
  STAKING_CONTRACT_ABI,
  wallet
);

router.post('/stake', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ success: false, error: 'Amount required' });

    const tx = await contract.stake({ value: ethers.parseEther(amount) });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/unstake', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ success: false, error: 'Amount required' });

    const tx = await contract.unstake(ethers.parseEther(amount));
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/stakes', async (req, res) => {
  try {
    const user = req.query.address as string;
    if (!user) return res.status(400).json({ success: false, error: 'Address required' });

    const stake = await contract.getStakes(user);
    res.json({ success: true, data: ethers.formatEther(stake) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;