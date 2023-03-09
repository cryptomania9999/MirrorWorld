import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Item.module.less";
import Footer from "./components/footer";
import { useRouter } from "next/router";
import { getNft, getNftActivities, getUser } from "./api/request";
import React, { useEffect, useState } from "react";
import { Divider } from "antd-mobile";
import { relative } from "path";
import { redirect } from "next/dist/server/api-utils";
import { canUseDom } from '@/utils/dom';

// let pageSize = 1;
let activitylist: any = [];

const NftItem = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [activity, setActivity] = useState(new Array());
  const [init, setInit] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [pageSize, setPageSize] = useState(1);
  const { query } = router;
  const getAddress = () => {
    const queryString = canUseDom ? window.location.search : "";
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("addr");
  };

  const getData = async () => {
    const res = await getNftActivities(
      // @ts-ignore
      getAddress("addr"),
      pageSize
    );
    if (!res?.data?.data?.events) return;
    let array = [...activitylist];
    array[pageSize] = [...res?.data?.data?.events];
    // pageSize = pageSize + 1;
    setPageSize(pageSize + 1);
    activitylist = JSON.parse(JSON.stringify(array));
    setActivity(activitylist);
    // @ts-ignore
    window.lock = false;
  };
  useEffect(() => {
    const a = () => {
      setScrollTop(document.documentElement.scrollTop);
      if (!document) return;
      // @ts-ignore
      if (window?.lock) return;
      if (
        document.documentElement.scrollHeight -
          document.documentElement.scrollTop -
          document.documentElement.clientHeight <
        3
      ) {
        console.log(
          "slide bottom",
          document.documentElement.scrollHeight -
            document.documentElement.scrollTop -
            document.documentElement.clientHeight
        );
        // @ts-ignore
        window.lock = true;
        getData();
      }
    };
    document.addEventListener("scroll", a);
    return function cleanup() {
      // @ts-ignore
      if (window?.lock) {
        // @ts-ignore
        delete window?.lock;
        // pageSize = 1;
        // window?.lock = false;
      }
      // pageSize = 1;
      document.removeEventListener("scroll", a);
    };
  });
  useEffect(() => {
    if (init) return;
    setInit(true);
    getNft(
      // @ts-ignore
      getAddress("addr")
      //"9GeknX5dxZgAV6XtYaTFsTrv1BFjLgYNKNs7egMqqDCB"
    ).then((res: any) => {
      setData(res?.data?.data);
    });
    getUser().then((res) => {
      setUserInfo(res);
    });
    // @ts-ignore
    // if (window.lock) return;
    // if (pageSize === 1) {
    //   // @ts-ignore
    //   window.lock = true;
    //   getData();
    // }
  });
  const getSelectedStatus = (name: string) => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    const top = document?.querySelector(name)?.offsetTop;
    if (top > scrollTop + 200 && top < scrollTop + 350) {
      return true;
    } else {
      return false;
    }
  };

  const anchor = (name: string) => {
    document.documentElement.scrollTop =
      // @ts-ignore
      document?.querySelector(name)?.offsetTop - 250;
  };
  return (
    <>
      {/* @ts-ignore */}
      {!data?.name && (
        <img
          src="/images/void.png"
          alt=""
          style={{
            width: "100%",
            marginTop: "40px",
          }}
        />
      )}
      {/* @ts-ignore */}
      {data?.name && (
        <div className={styles["nft_item"]}>
          <div className={styles["top_navbar"]}>
            <img
              src="/images/icon/arrorw/icon_arrow_up_line.svg"
              alt=""
              onClick={() => {
                router.push("/");
              }}
            />
            <img
              src="/images/icon/icon_refresh.svg"
              alt=""
              onClick={() => {
                window.location.reload();
              }}
            />
          </div>
          {
            // @ts-ignore
            scrollTop > 80 && data?.off_chain_attribute?.length ? (
              <div className={styles["top_anchor"]}>
                <a
                  // href="#In-Game-Performance"
                  onClick={() => {
                    anchor("#In-Game-Performance");
                  }}
                  style={
                    getSelectedStatus("#In-Game-Performance")
                      ? {
                          color: "#386EEC",
                          borderBottom: "3px solid #386EEC",
                        }
                      : {}
                  }
                >
                  In-Game Performance
                </a>
                <a
                  onClick={() => {
                    anchor("#On-Chain-Attribute");
                  }}
                  // href="#On-Chain-Attribute"
                  style={
                    getSelectedStatus("#On-Chain-Attribute")
                      ? {
                          color: "#386EEC",
                          borderBottom: "2px solid #386EEC",
                        }
                      : {}
                  }
                >
                  On-Chain Attribute
                </a>
                <a
                  onClick={() => {
                    anchor("#Details");
                  }}
                  // href="#Details"
                  style={
                    getSelectedStatus("#Details")
                      ? {
                          color: "#386EEC",
                          borderBottom: "2px solid #386EEC",
                        }
                      : {}
                  }
                >
                  Details
                </a>
                {activity?.length ? (
                  <a
                    onClick={() => {
                      anchor("#Activities");
                    }}
                    // href="#Activities"
                    style={
                      getSelectedStatus("#Activities")
                        ? {
                            color: "#386EEC",
                            borderBottom: "2px solid #386EEC",
                          }
                        : {}
                    }
                  >
                    Activities
                  </a>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )
          }
          <div className={styles["info"]}>
            <img
              // @ts-ignore
              src={data?.image}
              onClick={() => {
                router.push("/search");
              }}
            ></img>
            <p>
              {/*  @ts-ignore */}
              <span>{data?.name}</span>
              {/*  @ts-ignore */}
              <span>
                <img
                  style={{
                    width: "14px",
                    height: "14px",
                    margin: "0px",
                    display: "inline-block",
                    position: "relative",
                    top: "2px",
                  }}
                  src="/images/icon/solana_blue.svg"
                  alt=""
                />
                {/*  @ts-ignore */}
                {data?.price || "-"}
              </span>
            </p>
          </div>
          {
            // @ts-ignore
            data?.off_chain_attribute?.length ? (
              <p className={styles["title"]} id="In-Game-Performance">
                In-Game Performance
              </p>
            ) : (
              ""
            )
          }
          {
            // @ts-ignore
            data?.off_chain_attribute?.length ? (
              <div className={styles["skills"]}>
                {/* @ts-ignore */}
                {data?.off_chain_attribute?.map((item: any, index: number) => {
                  return (
                    <p key={index}>
                      <img
                        src={item?.image}
                        alt=""
                        style={{
                          float: "left",
                          marginRight: "10px",
                          width: "20px",
                        }}
                      />
                      <span>{item?.trait_type}</span>
                      <span>{item?.value}</span>
                    </p>
                  );
                })}
              </div>
            ) : (
              ""
            )
          }
          {/* @ts-ignore */}
          {data?.skill_attributes?.length ? (
            <div className={styles["skills_set"]}>
              <p>Passive Skill Set </p>
              {/* @ts-ignore */}
              {data?.skill_attributes?.map((item: any, index: number) => {
                return (
                  <div key={index} className={styles["skills_set_item"]}>
                    <img
                      src={item.image}
                      // onClick={() => {
                      //   router.push("/search");
                      // }}
                    ></img>
                    <p
                      style={{
                        width: "100%",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          <p className={styles["title"]} id="On-Chain-Attribute">
            On-Chain Attribute
          </p>
          <div className={styles["On_Chain"]}>
            {/*  @ts-ignore */}
            {data?.attributes?.map((item: any) => {
              return (
                <div key={item?.trait_type}>
                  <span>{item?.trait_type}</span>
                  <span>{item?.value}</span>
                </div>
              );
            })}
            {/* <div>
          <span>Backgroung</span>
          <span>Pink</span>
        </div>
        <div>
          <span>Skin</span>
          <span>Red</span>
        </div>
        <div>
          <span>Shoes</span>
          <span>Wasteland Boots, Purple, Line break effect</span>
        </div>
        <div>
          <span>Hair</span>
          <span>Yuki-onna</span>
        </div> */}
          </div>
          <p className={styles["title"]} id="Details">
            Details
          </p>
          <div className={styles["On_Chain"]}>
            {/*  @ts-ignore */}
            {data?.mint_address ? (
              <div>
                <span>Mint Address</span>
                {/*  @ts-ignore */}
                <span>{`${data?.mint_address?.slice(
                  0,
                  4
                  /*  @ts-ignore */
                )}...${data?.mint_address?.slice(-4)}`}</span>
              </div>
            ) : (
              ""
            )}
            {/*  @ts-ignore */}
            {data?.token_address ? (
              <div>
                <span>Token Address</span>
                {/*  @ts-ignore */}
                <span>{`${data?.token_address?.slice(
                  0,
                  4
                  /*  @ts-ignore */
                )}...${data?.token_address?.slice(-4)}`}</span>
              </div>
            ) : (
              ""
            )}
            {/*  @ts-ignore */}
            {data?.owner_address ? (
              <div>
                <span>Owner Address</span>
                {/*  @ts-ignore */}
                <span>{`${data?.owner_address?.slice(
                  0,
                  4
                  /*  @ts-ignore */
                )}...${data?.owner_address?.slice(-4)}`}</span>
              </div>
            ) : (
              ""
            )}
          </div>
          {activity?.length ? (
            <p className={styles["title"]} id="Activities">
              Activities
            </p>
          ) : (
            ""
          )}
          {activity?.length ? (
            <div className={styles["activities"]}>
              <div className={styles["table-header"]}>
                <span>Event</span>
                <span>Price</span>
                <span>Date</span>
              </div>
              {activity.map((item, index) => {
                return (
                  <div key={index}>
                    {item?.length
                      ? //  @ts-ignore
                        item.map((childItem, childIndex) => {
                          return (
                            <div
                              key={childIndex}
                              className={styles["table-item"]}
                            >
                              <span>{childItem?.event_type}</span>

                              <span
                                style={{
                                  position: "relative",
                                  top: "-4px",
                                }}
                              >
                                {childItem?.price && (
                                  <img
                                    src="/images/icon/icon_Solana.svg"
                                    alt=""
                                    style={{
                                      position: "relative",
                                      top: "4px",
                                    }}
                                  />
                                )}
                                {childItem?.price}
                              </span>
                              <span>{childItem?.date_tag}</span>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
          {/*@ts-ignore */}
          {// @ts-ignore
          data?.listed &&
          // @ts-ignore
          userInfo?.wallet?.sol_address !== data.owner_address ? (
            <Footer data={data} userInfo={userInfo}></Footer>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default NftItem;
