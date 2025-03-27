// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {VennFirewallConsumer} from "@ironblocks/firewall-consumer/contracts/consumers/VennFirewallConsumer.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleStorage is VennFirewallConsumer, Ownable {
    mapping(string => uint256) private valueStore;
    
    event ValueSet(string indexed key, uint256 value);
    event ValueRemoved(string indexed key);
    
    constructor() Ownable(msg.sender) {}
    
    function setValue(string memory key, uint256 value) public firewallProtected {
        valueStore[key] = value;
        emit ValueSet(key, value);
    }
    
    function getValue(string memory key) public view returns (uint256) {
        return valueStore[key];
    }
    
    function removeValue(string memory key) public onlyOwner firewallProtected {
        delete valueStore[key];
        emit ValueRemoved(key);
    }
    
    function hasKey(string memory key) public view returns (bool) {
        return valueStore[key] != 0;
    }
}