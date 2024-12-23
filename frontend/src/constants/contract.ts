export const ORDERLY_DOMAIN_ADDRESS =
  "0x851281B0d5F8B84c7c18eF66ea4C2B02AF084927";

export const ORDERLY_DOMAIN_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DomainExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "DomainNotAvailable",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDomainName",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidYearDuration",
    type: "error",
  },
  {
    inputs: [],
    name: "NoPrimaryDomain",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "resolvedAddress",
        type: "string",
      },
    ],
    name: "AddressUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceETH",
        type: "uint256",
      },
    ],
    name: "DomainRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "newExpirationDate",
        type: "uint96",
      },
    ],
    name: "DomainRenewed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "DomainTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
    ],
    name: "PrimaryDomainSet",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_EXTENSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_PRICE_USD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ETH_USD_PRICE_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REGISTRATION_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "domains",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "expirationDate",
        type: "uint96",
      },
      {
        internalType: "string",
        name: "resolvedAddress",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "getDomainInfo",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "resolvedAddress",
        type: "string",
      },
      {
        internalType: "uint96",
        name: "expirationDate",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getDomainsByOwner",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "domainHashes",
        type: "bytes32[]",
      },
      {
        internalType: "string[]",
        name: "names",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "resolvedAddresses",
        type: "string[]",
      },
      {
        internalType: "uint96[]",
        name: "expirationDates",
        type: "uint96[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "getPrimaryDomain",
    outputs: [
      {
        internalType: "bytes32",
        name: "nameHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "resolvedAddress",
        type: "string",
      },
      {
        internalType: "uint96",
        name: "expirationDate",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegistrationPriceETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "isDomainAvailable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "isDomainExpired",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "primaryDomain",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pyth",
    outputs: [
      {
        internalType: "contract IPyth",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_resolvedAddress",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_years",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_setPrimary",
        type: "bool",
      },
    ],
    name: "registerDomain",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_years",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "priceUpdateData",
        type: "bytes[]",
      },
    ],
    name: "renewDomain",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "setPrimaryDomain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferDomain",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_newAddress",
        type: "string",
      },
    ],
    name: "updateResolvedAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
