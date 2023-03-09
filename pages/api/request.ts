import axios, { AxiosInstance } from "axios";
import userConfig from "@/userConfig.json";
import { toast } from "sonner";
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  __mirrorworld,
} from "@/hooks/use-mirrorworld";
import { canUseDom } from "@/utils/dom";
import { eventBus } from "@/utils/bus";

declare let window: any;

const ifProduct = userConfig.xApiKey.length < 42;
let request: any = null;
let requestV2: AxiosInstance | null = null;

const mirrorworld = __mirrorworld;

const getAUTH = () => {
  const queryString = canUseDom ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  const auth = urlParams.get("auth");
  auth && window.localStorage.setItem("auth", auth);
  return auth;
};

const requestInterception = () => {
  if (request) return;
  request = axios.create({
    baseURL: ifProduct
      ? `https://api.mirrorworld.fun/v1/marketplace/`
      : `https://api-staging.mirrorworld.fun/v1/marketplace/`,
    headers: {
      Authorization: `Bearer ${
        getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
      }`,
      "x-api-key": userConfig.xApiKey,
    },
  });
  mirrorworld._api.client.defaults.headers.common.Authorization = `Bearer ${
    getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
  }`;
  mirrorworld._api.sso.defaults.headers.common.Authorization = `Bearer ${
    getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
  }`;
};

const requestInterceptionV2 = () => {
  if (requestV2) return requestV2;
  requestV2 = axios.create({
    baseURL: ifProduct
      ? `https://api.mirrorworld.fun/v2`
      : `https://api-staging.mirrorworld.fun/v2`,
    headers: {
      Authorization: `Bearer ${
        getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
      }`,
      "x-api-key": userConfig.xApiKey,
    },
  });
  mirrorworld._api.client.defaults.headers.common.Authorization = `Bearer ${
    getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
  }`;
  mirrorworld._api.sso.defaults.headers.common.Authorization = `Bearer ${
    getAUTH() || canUseDom ? window.localStorage.auth : "UNDEFINED"
  }`;

  return requestV2;
};

function toSolanaNetwork() {
  const network = userConfig.network;
  if (network === "mainnet") {
    return "mainnet-beta";
  } else if (network === "testnet") {
    return "testnet";
  } else {
    return "devnet";
  }
}

// Get collection info
export const getCollectionInfo = async () => {
  const requestV2 = requestInterceptionV2();
  const data = await requestV2.post(
    `/solana/${toSolanaNetwork()}/metadata/collections`,
    {
      collections: userConfig.collections,
    }
  );
  return data;
};

// get filter of collection Info
export const getCollectionFilter = async (collection: string) => {
  requestInterception();
  const data = await request.get(
    `collection/filter_info?collection=${collection}`
  );
  return data;
};

// get collection nfts
// {
//   "collection": "",
//   "page": 1,
//   "page_size": 20, // 最大 50
//   "order": {
//           "order_by": "price",
//           "desc": true
//       },
//   "filter": [
//       {
//           "filter_name": "Background",
//           "filter_type": "enum",
//           "filter_value": ["red", "blue"]  // 支持多个同时选择
//       },
//       {
//           "filter_name": "level",
//           "filter_type": "range",
//           "filter_range": [1, 10],    // 等级是 1 到 10 ，
//       }
//   ]
// }
export const getCollectionNfts = async (param: object) => {
  requestInterception();
  const data = await request.post(`nfts`, {
    ...param,
  });
  return data;
};

// Get search result
export const getNftSearch = async (search: string) => {
  requestInterception();
  const data = await request.post(`nft/search`, {
    //  @ts-ignore
    collections: userConfig.collections,
    search: search,
  });
  return data;
};

// Get search default
export const getNftRecommend = async (search: string) => {
  requestInterception();
  const data = await request.post(`nft/search/recommend`, {
    //  @ts-ignore
    collections: userConfig.collections,
  });
  return data;
};

async function login() {
  const result = await mirrorworld.login();

  if (result.user) {
    localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
    localStorage.setItem(AUTH_TOKEN_KEY, result.authToken);
  }
}

export const getNft = async (mintAddress: string) => {
  requestInterception();
  const data = await request.get(`nft/${mintAddress}`);
  return data;
};

// buy nft
export const buyNFT = async (mint_address: string, price: number) => {
  requestInterception();
  if (!mirrorworld.user) {
    toast("Logging in");
    await login();
  }
  const listing = await mirrorworld.buyNFT({
    mintAddress: mint_address,
    price: price,
    auctionHouse: userConfig.auctionHouse,
  });
  // const data = await request.post(`https://api-staging.mirrorworld.fun/v1/devnet/solana/marketplace/buy
  // `, {
  //   "mint_address": mint_address,
  //   "price": price,
  //   // "confirmation": "finalized"
  // })
  // return data;
  return listing;
};

// get nft activities
export const getNftActivities = async (search: string, pageSize: number) => {
  requestInterception();
  const data = await request.post(`nft/events`, {
    mint_address: search,
    page: pageSize,
    page_size: 10, // max 50
  });
  return data;
};

// get user info
export const getUser = async () => {
  requestInterception();
  const user = await mirrorworld.fetchUser();
  eventBus.emit("user", user);
  return user;
};

// updateNFTListing
export const updateNFTListing = async (mint_address: string, price: number) => {
  requestInterception();
  if (!mirrorworld.user) {
    toast("Logging in");
    await login();
  }
  const listing = await mirrorworld.updateNFTListing({
    mintAddress: mint_address,
    price: price, // Amount in SOL
    auctionHouse: userConfig.auctionHouse,
  });
  return listing;
};

// cancelNFTListing
export const cancelNFTListing = async (mint_address: string, price: number) => {
  requestInterception();
  if (!mirrorworld.user) {
    toast("Logging in");
    await login();
  }
  const listing = await mirrorworld.cancelNFTListing({
    mintAddress: mint_address,
    price: price, // Amount in SOL
    auctionHouse: userConfig.auctionHouse,
  });
  return listing;
};

// transferNFT
export const transferNFT = async (
  mintAddress: string,
  recipientAddress: string
) => {
  requestInterception();
  console.log(mintAddress, recipientAddress);
  if (!mirrorworld.user) {
    toast("Logging in");
    await login();
  }
  const transactionResult = await mirrorworld.transferNFT({
    mintAddress: mintAddress,
    recipientAddress: recipientAddress,
  });

  return transactionResult;
};

// getprice

export const getPrice = async (price: number) => {
  requestInterception();
  const data = await request.post(`nft/real_price`, {
    price: price,
    //  @ts-ignore
    fee: userConfig.serviceFee * 1000, // 0.001% ～ 100% 对应 1 ～ 100000
  });
  return data;
};
