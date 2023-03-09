/**
 * Return
 * - user
 * - mirrorworld
 * - login function
 */
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { toast } from "sonner"
import { ClusterEnvironment, IUser, MirrorWorld } from "@mirrorworld/web3.js";
import storefrontConfig from "../userConfig.json";
import { canUseDom } from '@/utils/dom';
import { eventBus } from '@/utils/bus';

export interface IMirrorWorldContext {
  user?: IUser;
  mirrorworld: MirrorWorld;
  login(): Promise<void>;
  logout(): Promise<void>;
}

const MIRROR_WORLD_API_KEY = storefrontConfig.xApiKey

const MirrorWorldContext = createContext<IMirrorWorldContext>(
  {} as IMirrorWorldContext
);


export const REFRESH_TOKEN_KEY = `x-storefront-${storefrontConfig.auctionHouse}-REFRESH_TOKEN_KEY`
export const AUTH_TOKEN_KEY = `x-storefront-${storefrontConfig.auctionHouse}-AUTH_TOKEN_KEY`
const auth = {
  authToken: canUseDom ? localStorage.getItem(AUTH_TOKEN_KEY) : undefined,
  refreshToken: canUseDom ? localStorage.getItem(REFRESH_TOKEN_KEY) : undefined,
}
const autoLoginCredentials = auth.refreshToken

export let __mirrorworld: MirrorWorld


function createMirrorWorld() {
  return new MirrorWorld({
    apiKey: storefrontConfig.xApiKey,
    env: storefrontConfig.network === "mainnet" ? ClusterEnvironment.mainnet : ClusterEnvironment.testnet,
     ...!!autoLoginCredentials && { autoLoginCredentials },
     auth: {
      ...auth.authToken && { authToken: auth.authToken },
      ...auth.refreshToken && { refreshToken: auth.refreshToken },
     }
  })
}

function tryCreateMirrorWorld() {
  try {
    return createMirrorWorld()
  } catch (error) {
    console.error(error)
    return createMirrorWorld()
  }
}

try {
  __mirrorworld = createMirrorWorld()
} catch (error) {
  console.error(error)
  __mirrorworld = tryCreateMirrorWorld()
}

let __user: IUser | undefined
__mirrorworld.on("auth:refreshToken", async (refreshToken) => {
  console.debug("auto-logging in user", refreshToken)
  if (canUseDom && refreshToken) {
    try {
      await localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken!);
      __user = await __mirrorworld.fetchUser();
    } catch (error) {
      console.warn("Error handling fetch user on refresh token", error)
    }
  }
});


export function useMirrorWorld() {
  return useContext(MirrorWorldContext);
}


export const MirrorWorldProvider = ({ children }: { children: ReactNode }) => {
  const [mirrorworld, setMirrorworld] = useState<MirrorWorld>(__mirrorworld);

  const [_user, setUser] = useState<IUser>();
  const isInitialized = useRef(false);

  const user = useMemo(() => _user || mirrorworld?.user || __user, [_user, mirrorworld])

  async function login() {
    if (!mirrorworld) throw new Error("Mirror World SDK is not initialized");
    const result = await mirrorworld.login();
    console.log("result", result);
    
    if (result.user) {
      setUser(result.user);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      localStorage.setItem(AUTH_TOKEN_KEY, result.authToken);
    }
  }

  useEffect(() => {
    if (!isInitialized.current) {
      __mirrorworld.on("auth:refreshToken", async (refreshToken) => {
        if (refreshToken) {
          const user = await __mirrorworld.fetchUser();
          setUser(user);
        }
      });

      isInitialized.current = true
    }

    return () => {
      isInitialized.current = true;
    };
  }, []);

  async function logout() {
    await mirrorworld.logout()
    localStorage.clear()
    setUser(undefined)
  }

  return (
    <MirrorWorldContext.Provider
      value={{
        mirrorworld: mirrorworld as MirrorWorld,
        user,
        login,
        logout
      }}
    >
      {children}
    </MirrorWorldContext.Provider>
  );
};
