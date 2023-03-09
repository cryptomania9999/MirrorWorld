import type { NextPage } from "next";
import styles from "../../styles/Search.module.less";
import { useRouter } from "next/router";
import { useMirrorWorld } from '@/hooks/use-mirrorworld';
import { truncateMiddle } from '@/utils/strings';
import { useEffect, useState } from 'react';
import { toast } from "sonner"
import storefrontConfig from "../../userConfig.json"

const LAMPORTS_PER_SOL = 1000000000

const Search = () => {
  const router = useRouter();
  const [solBalance, setSolBalance] = useState<number>(0.0)
  const { user, logout, login, mirrorworld } = useMirrorWorld()

  useEffect(() => {
    if (user &&  !!mirrorworld) {
      mirrorworld.getTokens().then((res: any) => {
        const solBalance = Number((res.sol / LAMPORTS_PER_SOL).toFixed(2))
        setSolBalance(solBalance)
      })
      // console.log(tokens)
    }
  }, [user, mirrorworld])

  function writeToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to wallet address")
  }

  return (
    <div className={styles.search}>
      <span className={styles.span}>
        {storefrontConfig.name || "Marketplace"}
      </span>
      
      <div className="search-actions">
        {!user ? (
          <button className={styles.auth_button} onClick={login}>
            Login
          </button>
        ): (
          <>
          <span style={{ cursor: "pointer"}} className={styles.auth_button} role="button" onClick={() => writeToClipboard(user.wallet!.sol_address)}>
            <>
              <span>
                {solBalance} SOL | {" "}
              </span>

              {truncateMiddle(user?.wallet!.sol_address)}
            </>
          </span>
          <button className={styles.auth_button_logout} onClick={logout}>
            Logout
          </button>
          </>
        )}
        <img
          src={"/images/icon/icon_search.svg"}
          onClick={() => {
            router.push("/search");
          }}
          alt="search"
        ></img>
      </div>
    </div>
  );
};

export default Search;
