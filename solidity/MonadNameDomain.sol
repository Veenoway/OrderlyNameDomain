// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract MonadNameService {
   IPyth public immutable pyth;
   bytes32 public constant ETH_USD_PRICE_ID = bytes32(0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace);
   uint256 public constant DOMAIN_PRICE_USD = 2 * 10**6;
   string public constant DOMAIN_EXTENSION = ".nads";
   
   struct DomainInfo {
       address owner;
       uint96 expirationDate;
       string resolvedAddress;
   }

   mapping(bytes32 => DomainInfo) public domains;
   mapping(address => bytes32[]) private ownerDomains;
   uint256 public constant REGISTRATION_DURATION = 365 days;

   event DomainRegistered(bytes32 indexed nameHash, address indexed owner, uint256 priceETH);
   event DomainTransferred(bytes32 indexed nameHash, address indexed from, address indexed to);
   event AddressUpdated(bytes32 indexed nameHash, string resolvedAddress);
   event DomainRenewed(bytes32 indexed nameHash, uint96 newExpirationDate);

   error InvalidDomainName();
   error InsufficientPayment();
   error DomainNotAvailable();
   error Unauthorized();
   error DomainExpired();

   constructor(address pythAddress) {
       pyth = IPyth(pythAddress);
   }

   function _hashName(string memory _name) internal pure returns (bytes32) {
       return keccak256(abi.encodePacked(_name, ".nads"));
   }

   function getRegistrationPriceETH() public view returns (uint256) {
       PythStructs.Price memory ethPrice = pyth.getPriceUnsafe(ETH_USD_PRICE_ID);
       int ethPriceUsd = ethPrice.price;
       if (ethPriceUsd <= 0) revert("Invalid ETH price");
       return (DOMAIN_PRICE_USD * 1e18) / uint256(ethPriceUsd);
   }

   function registerDomain(string calldata _name, string calldata _resolvedAddress, bytes[] calldata priceUpdateData) public payable {
       bytes32 nameHash = _hashName(_name);
       if(bytes(_name).length == 0) revert InvalidDomainName();
       
       pyth.updatePriceFeeds(priceUpdateData);
       uint256 currentPrice = getRegistrationPriceETH();
       if(msg.value < currentPrice) revert InsufficientPayment();
       
       DomainInfo storage domain = domains[nameHash];
       if(domain.owner != address(0) && block.timestamp < domain.expirationDate) revert DomainNotAvailable();
       
       domain.owner = msg.sender;
       domain.resolvedAddress = _resolvedAddress;
       domain.expirationDate = uint96(block.timestamp + REGISTRATION_DURATION);

       ownerDomains[msg.sender].push(nameHash);

       uint256 excess = msg.value - currentPrice;
       if (excess > 0) {
           (bool success, ) = msg.sender.call{value: excess}("");
           require(success, "Refund failed");
       }

       emit DomainRegistered(nameHash, msg.sender, currentPrice);
   }

   function renewDomain(string calldata _name, bytes[] calldata priceUpdateData) public payable {
       bytes32 nameHash = _hashName(_name);
       DomainInfo storage domain = domains[nameHash];
       
       if(domain.owner != msg.sender) revert Unauthorized();

       pyth.updatePriceFeeds(priceUpdateData);
       uint256 currentPrice = getRegistrationPriceETH();
       if(msg.value < currentPrice) revert InsufficientPayment();

       domain.expirationDate = uint96(
           block.timestamp >= domain.expirationDate 
           ? block.timestamp + REGISTRATION_DURATION 
           : domain.expirationDate + REGISTRATION_DURATION
       );

       uint256 excess = msg.value - currentPrice;
       if (excess > 0) {
           (bool success, ) = msg.sender.call{value: excess}("");
           require(success, "Refund failed");
       }

       emit DomainRenewed(nameHash, domain.expirationDate);
   }

   function updateResolvedAddress(string calldata _name, string calldata _newAddress) public {
       bytes32 nameHash = _hashName(_name);
       DomainInfo storage domain = domains[nameHash];
       
       if(domain.owner != msg.sender) revert Unauthorized();
       if(block.timestamp >= domain.expirationDate) revert DomainExpired();

       domain.resolvedAddress = _newAddress;
       emit AddressUpdated(nameHash, _newAddress);
   }

   function transferDomain(string calldata _name, address _newOwner) public {
       bytes32 nameHash = _hashName(_name);
       DomainInfo storage domain = domains[nameHash];
       
       if(domain.owner != msg.sender) revert Unauthorized();
       if(block.timestamp >= domain.expirationDate) revert DomainExpired();

       bytes32[] storage oldOwnerDomains = ownerDomains[msg.sender];
       uint256 length = oldOwnerDomains.length;
       for (uint256 i = 0; i < length;) {
           if (oldOwnerDomains[i] == nameHash) {
               oldOwnerDomains[i] = oldOwnerDomains[length - 1];
               oldOwnerDomains.pop();
               break;
           }
           unchecked { ++i; }
       }

       domain.owner = _newOwner;
       ownerDomains[_newOwner].push(nameHash);

       emit DomainTransferred(nameHash, msg.sender, _newOwner);
   }

   function isDomainAvailable(string calldata _name) public view returns (bool) {
       bytes32 nameHash = _hashName(_name);
       DomainInfo memory domain = domains[nameHash];
       return domain.owner == address(0) || block.timestamp >= domain.expirationDate;
   }

   function isDomainExpired(string calldata _name) public view returns (bool) {
       bytes32 nameHash = _hashName(_name);
       return block.timestamp >= domains[nameHash].expirationDate;
   }

   function getDomainInfo(string calldata _name) public view returns (
       address owner,
       string memory resolvedAddress,
       uint96 expirationDate
   ) {
       bytes32 nameHash = _hashName(_name);
       DomainInfo memory info = domains[nameHash];
       return (info.owner, info.resolvedAddress, info.expirationDate);
   }

   function getDomainsByOwner(address owner) public view returns (
       bytes32[] memory domainHashes,
       string[] memory resolvedAddresses,
       uint96[] memory expirationDates
   ) {
       bytes32[] memory ownerDomainsList = ownerDomains[owner];
       uint256 length = ownerDomainsList.length;
       resolvedAddresses = new string[](length);
       expirationDates = new uint96[](length);

       for (uint256 i = 0; i < length;) {
           DomainInfo memory info = domains[ownerDomainsList[i]];
           resolvedAddresses[i] = info.resolvedAddress;
           expirationDates[i] = info.expirationDate;
           unchecked { ++i; }
       }

       return (ownerDomainsList, resolvedAddresses, expirationDates);
   }
}