import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SearchBar } from "antd-mobile";
import { useRouter } from "next/router";

import { getNftSearch, getNftRecommend } from "./api/request";

const Search: NextPage = () => {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [key, setKey] = useState("");
  const [NftRecommend, setNftRecommend] = useState([]);
  const [first, setFirst] = useState(false);
  const searchNft = async (e: any) => {
    const data = await getNftSearch(e.target.value);
    setKey(e.target.value);
    setList(data?.data?.data);
  };
  if (!first) {
    setFirst(true);
    // @ts-ignore
    getNftRecommend().then((res) => {
      setNftRecommend(res?.data?.data || []);
    });
  }

  return (
    <div className="search_page">
      <div
        style={{
          position: "fixed",
          top: "0px",
          width: "100%",
          zIndex: 100,
          background: "#f5f6fa",
          padding: "10px 0px 5px",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="input_search_container">
            <input
              placeholder="NFT Name"
              onChange={(e) => {
                setKey(e.target.value || "");
                searchNft(e);
              }}
              value={key}
            ></input>
            {key && (
              <img
                className="search_clear"
                src="/images/icon/icon_delete.svg"
                alt=""
                onClick={() => {
                  setKey("");
                }}
              />
            )}
          </div>
          <span
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </span>
        </div>
        <img
          style={{
            width: "100%",
            position: "absolute",
            bottom: "-20px",
          }}
          src="/images/background.png"
          alt=""
        />
      </div>
      <div className="search-result">
        {!key && <p className="search_page_title">Everyone is Searching</p>}
        {key && list?.length
          ? list.map((item: any) => {
              return (
                <p
                  key={item?.mint_address}
                  className="search_page_item"
                  onClick={() => {
                    // @ts-ignore
                    router.push("/item?addr=" + item?.mint_address);
                  }}
                >
                  {/* @ts-ignore */}
                  <img src={item?.image} alt="" />
                  <p
                    dangerouslySetInnerHTML={{
                      // @ts-ignore
                      __html: item?.name.replace(
                        key,
                        `<b style="color: #386EEC;font-weight: normal">${key}</b>`
                      ),
                    }}
                  ></p>
                </p>
              );
            })
          : ""}
        {key && !list?.length ? (
          <div className="no_content">
            <img src="/images/default/nothing_pic.svg" alt="" />
            <p>No NFT Listed</p>
          </div>
        ) : (
          ""
        )}
        {!key && NftRecommend.length
          ? NftRecommend.map((item: any, index: number) => {
              return (
                <p
                  key={item?.mint_address}
                  className="search_page_item"
                  onClick={() => {
                    // @ts-ignore
                    router.push("/item?addr=" + item?.mint_address);
                  }}
                >
                  {/* @ts-ignore */}
                  <img src={item?.image} alt="" />
                  {/* @ts-ignore */}
                  <p> {item?.name}</p>
                </p>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default Search;
