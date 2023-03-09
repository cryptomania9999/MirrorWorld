import styles from "../styles/Sell.module.less";
import React, { useEffect, useState } from "react";
import userConfig from "@/userConfig.json";

import { useRouter } from "next/router";
import {
  updateNFTListing,
  cancelNFTListing,
  transferNFT,
  getPrice,
} from "./api/request";

const Search = () => {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [realPrice, setRealPrice] = useState(0);

  // 0 no status, 1 success, 2 fail
  const [resultStatus, setResultStatus] = useState(0);
  const { type } = router?.query;

  // 0 no status 1 price 2 list canceling 3 list price 4 transfer
  const [operationStatus, setOperationStatus] = useState(0);
  const handleAction = async (type: number) => {
    switch (type) {
      case 1:
        try {
          // @ts-ignore
          await updateNFTListing(router?.query?.mintaddress, price);
          setOperationStatus(0);
          setResultStatus(1);
        } catch (error) {
          setOperationStatus(0);
          setResultStatus(2);
        }
        break;
      case 2:
        try {
          await cancelNFTListing(
            // @ts-ignore
            router?.query?.mintaddress,
            router?.query?.price
          );
          setOperationStatus(0);
          setResultStatus(1);
        } catch (error) {
          setOperationStatus(0);
          console.log(error);
          setResultStatus(2);
        }
        break;
      case 3:
        try {
          // @ts-ignore
          await updateNFTListing(router?.query?.mintaddress, price);
          setOperationStatus(0);
          setResultStatus(1);
        } catch (error) {
          setOperationStatus(0);
          setResultStatus(2);
        }
        break;
      case 4:
        try {
          // @ts-ignore
          await transferNFT(router?.query?.mintaddress, price);
          setOperationStatus(0);
          setResultStatus(1);
        } catch (error) {
          console.log(error, "stransfernft");
          setOperationStatus(0);
          setResultStatus(2);
        }
      default:
        break;
    }
  };
  const getMsg = () => {
    switch (operationStatus) {
      case 1:
        return `Do you want to set the price to ${price} SOL?`;
      case 2:
        return `Are you sure you want to cancel the list?`;
      case 3:
        return `Do you want to change the price to ${price} SOL?`;
      case 4:
        return `Are you sure you want to transfer the NFT?`;
      default:
        return `Do you want to set ?`;
    }
  };
  const getSucMsg = () => {
    switch (operationStatus) {
      case 1:
        return `Congratulations! Change Successfully`;
      case 2:
        return `Congratulations! Cancel Successfully`;
      case 3:
        return `Congratulations! List Successfully`;
      case 4:
        return `Congratulations! Transfer Successfully`;
      default:
        return `Congratulations!`;
    }
  };
  return (
    <div className={styles.sell}>
      {!resultStatus && !operationStatus && (
        <>
          {type !== "transfer" && (
            <div className={styles.sell_card}>
              <p>
                <span>
                  {router?.query?.type === "manage" ? "Manage List" : "List"}
                </span>
                <img
                  style={{
                    float: "right",
                    marginTop: "2px",
                  }}
                  src="/function.svg"
                  alt=""
                  onClick={() => {
                    window.location.href =
                      // window.location.hostname +
                      "/item?addr=" + router?.query?.mintaddress;
                  }}
                />
              </p>
              <p className={styles.sell_card_info}>
                {/* @ts-ignore */}
                <img src={router?.query?.imgUrl || ""} alt="" />
                <p>{router?.query?.name}</p>
                <p className={styles.sell_card_price}>
                  <img
                    style={{
                      width: "14px",
                      height: "14px",
                      margin: "0px",
                      display: "inline-block",
                      position: "relative",
                      top: "2px",
                      // float: "left",
                    }}
                    src="/images/icon/solana_blue.svg"
                    alt=""
                  />
                  {router?.query?.price}
                </p>
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={price}
                  onChange={async (e: any) => {
                    setPrice(e?.target?.value);
                    const data = await getPrice(e.target.value);
                    setRealPrice(data?.data?.data?.price || 0);
                  }}
                  onBlur={async () => {}}
                  style={{
                    borderColor: price.length > 8 ? "red" : "#f0f0f0",
                  }}
                />
                {realPrice ? (
                  price.length <= 8 ? (
                    <p className={styles.sell_card_sell_msg}>
                      You Will Reveive {realPrice} SOL
                    </p>
                  ) : (
                    <p
                      className={styles.sell_card_sell_msg}
                      style={{ color: "red" }}
                    >
                      Maximum 8 digits
                    </p>
                  )
                ) : (
                  ""
                )}
              </p>
              <p className={styles.sell_card_sell_info}>
                <p>
                  <span>Service Fee</span>
                  <span>
                    {/* @ts-ignore */}
                    {userConfig?.serviceFee ? userConfig.serviceFee : 0}%
                  </span>
                </p>
                <p>
                  <span>Listing/Cancel Fee</span>
                  <span>Free</span>
                </p>
              </p>
              {router?.query?.type !== "manage" && (
                <p
                  className={styles.submit_button}
                  style={{
                    opacity: +price ? 1 : 0.2,
                  }}
                  onClick={() => {
                    if (!+price) return;
                    setOperationStatus(1);
                  }}
                >
                  Confirm
                </p>
              )}
              {router?.query?.type === "manage" && (
                <div className={styles.manage_buttons}>
                  <p
                    onClick={() => {
                      setOperationStatus(2);
                    }}
                  >
                    Cancel Listing
                  </p>
                  <p
                    className={styles.submit_button}
                    style={{
                      opacity:
                        +price && price !== router?.query?.price ? 1 : 0.2,
                    }}
                    onClick={() => {
                      if (+price && price !== router.query.price) {
                        setOperationStatus(3);
                      }
                    }}
                  >
                    Confirm
                  </p>
                </div>
              )}
            </div>
          )}
          {type === "transfer" && (
            <div className={styles.sell_card}>
              <p>
                <span>Transfer</span>
                <img
                  style={{
                    float: "right",
                    marginTop: "2px",
                  }}
                  src="/function.svg"
                  alt=""
                  onClick={() => {
                    window.location.href =
                      // window.location.hostname +
                      "/item?addr=" + router?.query?.mintaddress;
                  }}
                />
              </p>
              <p className={styles.sell_card_info}>
                <img
                  // @ts-ignore
                  src={router?.query?.imgUrl}
                  alt=""
                  style={{
                    marginBottom: "0px",
                    width: "235px",
                    height: "235px",
                  }}
                />
                <p
                  style={{
                    lineHeight: "37px",
                    background: "#FFFFFF",
                    borderRadius: "0px 0px 10px 10px",
                    width: "235px",
                    margin: "0px auto 10px",
                  }}
                >
                  {router?.query?.name}
                </p>
                <input
                  placeholder="SoL Address"
                  value={price}
                  style={{
                    width: "235px",
                    // borderColor: price.length > 8 ? "red" : "#f0f0f0",
                  }}
                  // onBlur={async () => {
                  //   const data = await getPrice(price);
                  //   setRealPrice(data?.data?.data?.price || 0);
                  // }}
                  onChange={async (e: any) => {
                    setPrice(e?.target?.value);
                    // const data = await getPrice(e.target.value);
                    // setRealPrice(data?.data?.data?.price || 0);
                  }}
                />
              </p>
              {router?.query?.type !== "manage" && (
                <p
                  className={styles.submit_button}
                  style={{
                    opacity: price ? 1 : 0.2,
                  }}
                  onClick={() => {
                    if (!price) return;
                    setOperationStatus(
                      router?.query?.type === "transfer" ? 4 : 1
                    );
                  }}
                >
                  Confirm
                </p>
              )}
              {router?.query?.type === "manage" && (
                <div className={styles.manage_buttons}>
                  <p
                    onClick={() => {
                      setOperationStatus(2);
                    }}
                  >
                    Cancel Listing
                  </p>
                  <p
                    className={styles.submit_button}
                    style={{
                      opacity: +price && price !== router.query.price ? 1 : 0.2,
                    }}
                    onClick={() => {
                      if (+price && price !== router.query.pric) {
                        setOperationStatus(3);
                      }
                    }}
                  >
                    Confirm
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {resultStatus === 1 && (
        <div className={styles.default_image}>
          <p>
            <img
              style={{
                float: "right",
                marginTop: "2px",
              }}
              src="/function.svg"
              alt=""
              onClick={() => {
                setResultStatus(0);
                window.location.href =
                  // window.location.hostname +
                  "/item?addr=" + router?.query?.mintaddress;
              }}
            />
          </p>
          <img src="/images/default/success_pic.svg"></img>
          <p>{getSucMsg()}</p>
        </div>
      )}
      {resultStatus === 2 && (
        <div className={styles.default_image}>
          <p>
            <img
              style={{
                float: "right",
                marginTop: "2px",
              }}
              src="/function.svg"
              alt=""
              onClick={() => {
                setResultStatus(0);
                window.location.href =
                  // window.location.hostname +
                  "/item?addr=" + router?.query?.mintaddress;
              }}
            />
          </p>
          <img src="/images/default/success_pic.svg"></img>
          <p>
            Ops! <br />
            Please Try Again
          </p>
        </div>
      )}
      {operationStatus && (
        <div className={styles.double_confirm}>
          <p>{getMsg()}</p>
          <p>
            <span
              onClick={() => {
                setOperationStatus(0);
              }}
            >
              Cancel
            </span>
            <span
              onClick={() => {
                handleAction(operationStatus);
              }}
            >
              Confirm
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
