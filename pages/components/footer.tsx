import styles from "../../styles/Footer.module.less";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { buyNFT, getUser } from "../api/request";
import Loader from "./loader";

export interface props {
  data: any;
  userInfo: object;
}

const Footer = (props: props) => {
  const router = useRouter();
  const { data, userInfo } = props;
  const [buyModal, setBuyModal] = useState(false);
  const [resultStatus, setResultStatus] = useState(0);

  return (
    <>
      <div className={styles.footer}>
        {!buyModal && (
          <div className={styles.footer_container}>
            {/* @ts-ignore */}
            {data?.price ? (
              <div className={styles.footer_price}>
                <img
                  src="/images/icon/icon_Solana.svg"
                  alt=""
                  style={{
                    position: "relative",
                    top: "4px",
                    width: "22px",
                    height: "22px",
                    margin: "0px",
                  }}
                />
                {/* @ts-ignore */}
                {data?.price}
              </div>
            ) : (
              ""
            )}
            <div
              className={styles.footer_button}
              onClick={() => {
                // @ts-ignore
                if (userInfo?.wallet?.sol_address !== data?.owner_address) {
                  document.getElementsByTagName("body")[0].style.overflow =
                    "hidden";
                  setBuyModal(true);
                } else {
                  if (data?.price) {
                    router.push({
                      pathname: "/sell",
                      query: {
                        imgUrl: data?.image,
                        name: data?.name,
                        mintaddress: data?.mint_address,
                        type: "manage",
                        price: data?.price,
                      },
                    });
                  } else {
                    router.push({
                      pathname: "/sell",
                      query: {
                        imgUrl: data.image,
                        name: data.name,
                        mintaddress: data?.mint_address,
                      },
                    });
                  }
                }
              }}
              style={
                // @ts-ignore
                userInfo?.wallet?.sol_address === data?.owner_address &&
                !data?.price
                  ? {
                      width: "335px",
                      margin: "0 auto",
                    }
                  : {}
              }
            >
              {/*@ts-ignore */}
              {/* {userInfo?.wallet?.sol_address}----------
            {data?.owner_address}--------- */}
              {/* @ts-ignore */}
              {userInfo?.wallet?.sol_address === data?.owner_address
                ? // @ts-ignore
                  data?.price
                  ? "Manage List"
                  : "List"
                : "Buy"}
            </div>
          </div>
        )}
        {(buyModal || resultStatus === 2 || resultStatus === 3) &&
          resultStatus !== 4 &&
          resultStatus !== 1 && (
            <div
              className={styles.footer_button_buy}
              onClick={async () => {
                if (resultStatus === 2) {
                  return router.push("/");
                }
                setResultStatus(1);
                try {
                  // @ts-ignore
                  const res = await buyNFT(data?.mint_address, data?.price);
                  if (res) {
                    setResultStatus(2);
                  } else {
                    setResultStatus(3);
                  }
                } catch (error) {
                  if (
                    // @ts-ignore
                    error?.response?.data?.message ===
                    "ERROR_INSUFFICIENT_BALANCE"
                  ) {
                    setResultStatus(4);
                  } else {
                    setResultStatus(3);
                  }
                  // @ts-ignore
                  console.log(error.response.data.message, "error");
                }
              }}
            >
              {resultStatus === 2 || resultStatus === 3
                ? resultStatus === 2
                  ? "Back to Marketplace"
                  : "Retry"
                : "Buy"}
            </div>
          )}
        {buyModal && (
          <div className={styles.buymodal}>
            <p className={styles.rectangle}></p>
            <p className={styles.module_title}>
              Buy
              <img
                style={{
                  float: "right",
                  marginTop: "10px",
                }}
                src="/function.svg"
                alt=""
                onClick={() => {
                  setBuyModal(false);
                  document.getElementsByTagName("body")[0].style.overflow =
                    "auto";
                  setResultStatus(0);
                }}
              />
            </p>

            {!resultStatus && (
              <>
                <p className={styles.avar}>
                  <img src={data?.image} alt="" />
                  <p>
                    {" "}
                    <img
                      src="/images/icon/icon_Solana.svg"
                      alt=""
                      style={{
                        position: "relative",
                        top: "4px",
                        width: "22px",
                        height: "22px",
                        margin: "0px",
                      }}
                    />
                    {data?.price}
                  </p>
                  <p>Cost</p>
                </p>
                <div className={styles["skills"]}>
                  {data?.attributes?.map((item: any) => {
                    return (
                      <p key={item.trait_type}>
                        <img src="" alt="" />
                        <span>{item?.trait_type}</span>
                        <span>{item?.value}</span>
                      </p>
                    );
                  })}

                  {/* <p>
              <img src="" alt="" />
              <span>Rarity</span>
              <span>Common</span>
            </p>
            <p>
              <img src="" alt="" />
              <span>Attack</span>
              <span>76</span>
            </p>
            <p>
              <img src="" alt="" />
              <span>Defence</span>
              <span>100</span>
            </p>
            <p>
              <img src="" alt="" />
              <span>Health</span>
              <span>120</span>
            </p> */}
                </div>
              </>
            )}
            {/* <div className={styles["skills_set"]}>
            <p>Passive Skill Set</p>
            <span>Gravitational Shatter</span>
            <span>Gravitational Shatter</span>
            <span>Gravitational</span>
            <span>Gravitational Shatter</span>
          </div> */}
            {resultStatus === 1 && <Loader></Loader>}
            {resultStatus === 2 && (
              <div className={styles.default_image}>
                <img
                  src="/images/default/success_pic.svg"
                  onClick={() => {}}
                ></img>
                <p>Congratulations! Purchase Successful</p>
              </div>
            )}
            {(resultStatus === 3 || resultStatus === 4) && (
              <div className={styles.default_image}>
                <img src="/images/default/wrong_pic.svg"></img>
                <p>
                  {resultStatus === 4
                    ? "Insufficient Fund"
                    : "Ops! Please Try Again"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {buyModal && <div className={styles.Monolayer}></div>}
    </>
  );
};

export default Footer;
