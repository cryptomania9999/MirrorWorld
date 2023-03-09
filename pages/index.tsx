import styles from "../styles/Home.module.less";

import Search from "./components/search";
import Filter from "./components/filter";
import React, { useEffect, useMemo, useState } from "react";
import { getCollectionInfo, getCollectionNfts } from "./api/request";
import userConfig from "@/userConfig.json";
import { useRouter } from "next/router";
import { useMirrorWorld } from '@/hooks/use-mirrorworld';

const newList = new Array();
const Home = () => {

  const { mirrorworld } = useMirrorWorld()

  const user = useMemo(() => mirrorworld?.user, [mirrorworld])

  const [filterData, setFilterData] = useState([]);
  const [firstTime, setFirstTime] = useState(false);
  const [listHeight, setListHeight] = useState([]);
  const [questParam, setQuestParam] = useState({
    //  @ts-ignore
    collection: userConfig?.collections[0],
    page: 1,
    page_size: 10, // 最大 50
    order: {
      order_by: "price",
      desc: false,
    },
    sale: 0, // 0: all, 1: for sale; 2: not for sale
    filter: [],
  });
  // const [list, setList] = useState(new Array(new Array(), new Array()));
  const router = useRouter();
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [scrollTop, setScrollTop] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = (val: object, name: string) => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    //  @ts-ignore
    const param = JSON.parse(JSON.stringify(questParam));
    param.page = 1;
    param[name] = val;
    setQuestParam(JSON.parse(JSON.stringify(param)));
    setData([]);
    getNFTS(param);
  };
  const getCollectionInfoFunc = async () => {
    setFirstTime(true);
    const data = await getCollectionInfo();
    const param = JSON.parse(JSON.stringify(questParam));
    param.page = 1;
    param["collection"] = data?.data?.data?.[0].collection;
    setQuestParam(JSON.parse(JSON.stringify(param)));
    setFilterData(data?.data?.data);
    getNFTS(param);
  };
  const getNFTS = async (param: any) => {
    setLoading(true);
    if (param.page > totalPage && param.page !== 1) {
      setLoading(false);
      return;
    }
    const data = await getCollectionNfts(param);
    setLoading(false);
    // @ts-ignore
    window.lock = false;
    // @ts-ignore
    if (data?.data?.data?.nfts) {
      const listdata = data?.data?.data;
      setTotalPage(listdata?.total_page);
      // const newList = JSON.parse(JSON.stringify(data));
      // @ts-ignore
      if (param.page === 1) {
        // @ts-ignore
        newList = [];
      }
      newList[param.page - 1] = listdata?.nfts;
      console.log(newList, "newList");
      setData(JSON.parse(JSON.stringify([].concat.apply([], newList))));
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    const a = () => {
      if (!document) return;
      if (
        // @ts-ignore
        document?.querySelector("#filter").offsetTop <
        document.documentElement.scrollTop
      ) {
        setScrollTop(true);
      } else {
        setScrollTop(false);
      }
      // @ts-ignore
      if (window?.lock) return;
      if (
        document.documentElement.scrollHeight -
          document.documentElement.scrollTop -
          document.documentElement.clientHeight <
        100
      ) {
        // console.log("slide bottom");
        // @ts-ignore
        window.lock = true;
        const param = JSON.parse(JSON.stringify(questParam));
        param.page = questParam.page + 1;
        setQuestParam(JSON.parse(JSON.stringify(param)));
        getNFTS(param);
      }
    };
    document.addEventListener("scroll", a);
    return function cleanup() {
      document.removeEventListener("scroll", a);
    };
  });
  if (!firstTime) {
    getCollectionInfoFunc();
  }

  useEffect(() => {
    console.log("user", user)
  }, [user])




  return (
    <div>
      <div
        style={{
          // position: "sticky",
          top: "0px",
          width: "100%",
          zIndex: 99,
          background: "#f5f6fa",
          position: "relative",
        }}
      >
        <Search></Search>
        {filterData?.length ? (
          <Filter
            search={search}
            data={filterData}
            style={
              scrollTop
                ? {
                    position: "fixed",
                    top: "0px",
                    width: "100%",
                    background: "#f5f6fa",
                    zIndex: "999",
                  }
                : {}
            }
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles.nft_list}>
        <div>
          {!data?.length && (
            <div className={styles.no_content}>
              <img src="/images/default/nothing_pic.svg" alt="" />
              <p>No NFT Listed</p>
            </div>
          )}
          {data?.length ? (
            <div className={styles.nft_list_container}>
              {data.map((item: any, index: number) => {
                // if (index === data.length - 1 && index % 2 === 0) {
                return (
                  // <div
                  //   // @ts-ignore
                  //   key={item?.mint_address}
                  //   className={index + "datalist"}
                  //   style={{
                  //     overflow: "hidden",
                  //   }}
                  // >
                  <div
                    key={item?.mint_address}
                    className={styles.nft_list_item}
                    onClick={() => {
                      // @ts-ignore
                      router.push("/item?addr=" + item?.mint_address);
                    }}
                  >
                    {/*@ts-ignore */}
                    <img src={item?.image} alt="" />
                    <p>
                      <img
                        src="/images/icon/icon_Solana.svg"
                        alt=""
                        style={{
                          width: "18px",
                          height: "18px",
                          position: "relative",
                          top: "3px",
                        }}
                      />
                      {/*@ts-ignore */}
                      {item?.price || "-"}
                    </p>
                    {/*@ts-ignore */}
                    <p>{item?.name.split("#")[0] || "-"}</p>
                    <p>#{item?.name.split("#")[1] || "-"}</p>
                  </div>
                  // </div>
                );
                // }
                // if (!(index % 2 === 0)) return;
                // return (
                //   <div
                //     className={index + "datalist"}
                //     style={{
                //       overflow: "hidden",
                //     }}
                //     // @ts-ignore
                //     key={data[index]?.mint_address}
                //   >
                //     <div
                //       // @ts-ignore
                //       key={data[index]?.mint_address}
                //       className={styles.nft_list_item}
                //       onClick={() => {
                //         // @ts-ignore
                //         router.push("/item?addr=" + data[index]?.mint_address);
                //       }}
                //       // style={{
                //       //   height: listHeight[index],
                //       // }}
                //     >
                //       {/*@ts-ignore */}
                //       <img src={data[index]?.image} alt="" />
                //       <p>
                //         <img
                //           src="/images/icon/icon_Solana.svg"
                //           alt=""
                //           style={{
                //             width: "18px",
                //             height: "18px",
                //             position: "relative",
                //             top: "3px",
                //           }}
                //         />
                //         {/*@ts-ignore */}
                //         {data[index]?.price || "-"}
                //       </p>
                //       {/*@ts-ignore */}
                //       <p>{data[index]?.name || "-"}</p>
                //     </div>
                //     <div
                //       // style={{
                //       //   height: listHeight[index],
                //       // }}
                //       // @ts-ignore
                //       key={data[index + 1]?.mint_address}
                //       className={styles.nft_list_item}
                //       onClick={() => {
                //         // @ts-ignore
                //         router.push(
                //           // @ts-ignore
                //           "/item?addr=" + data[index + 1]?.mint_address
                //         );
                //       }}
                //     >
                //       {/*@ts-ignore */}
                //       <img src={data[index + 1]?.image} alt="" />
                //       <p>
                //         <img
                //           src="/images/icon/icon_Solana.svg"
                //           alt=""
                //           style={{
                //             width: "18px",
                //             height: "18px",
                //             position: "relative",
                //             top: "3px",
                //           }}
                //         />
                //         {/*@ts-ignore */}
                //         {data[index + 1]?.price || "-"}
                //       </p>
                //       {/*@ts-ignore */}
                //       <p>{data[index + 1]?.name || "-"}</p>
                //     </div>
                //   </div>
                // );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
        {loading && (
          <img
            src="/images/loading.gif"
            alt=""
            style={{
              margin: " 10px auto 0",
              display: "block",
              width: "30px",
            }}
          />
        )}
      </div>
      {questParam.page >= totalPage && data?.length ? (
        <div className={styles.nft_list_bottom}>
          <img src="/images/icon/left.svg" alt="" />
          The Bottom
          <img src="/images/icon/right.svg" alt="" />
        </div>
      ) : (
        ""
      )}
      <div className={styles.nft_list_footer}>
        <img src="/images/logo.svg" alt="" />
      </div>
    </div>
  );
};

export default Home;
