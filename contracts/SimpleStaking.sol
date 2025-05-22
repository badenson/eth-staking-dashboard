// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStaking {
    mapping(address => uint256) public balances;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    function stake() external payable {
        require(msg.value > 0, "Must send ETH to stake");
        balances[msg.sender] += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough staked");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Unstaked(msg.sender, amount);
    }

    function getStakes(address user) external view returns (uint256) {
        return balances[user];
    }
}