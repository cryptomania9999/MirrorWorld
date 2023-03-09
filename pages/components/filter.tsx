import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Filter.module.less";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCollectionFilter, getCollectionNfts } from "../api/request";
import  userConfig  from "@/userConfig.json";
import { json } from "stream/consumers";

export interface props {
  search: Function;
  data: Array<object>;
  style: object;
}

let mounted = false

const Filter = (props: props) => {
  const { search, data, style } = props;
  const [collectionSelected, setCollectionSelected] = useState(0);
  const [orderSearch, setOrderSearch] = useState(false);
  const [orderFilterData, setOrderFilterData] = useState([]);
  const [orderSearchVal, setOrderSearchVal] = useState(0);

  //  0: for sale; 1: not for sale;2: all,
  const [saleSearchVal, setSaleSearchVal] = useState(2);
  const [showSaleSearch, setShowSaleSearch] = useState(false);

  const [filterSearch, setFilterSearch] = useState(false);
  const [filterSearchval, setFilterSearchval] = useState([]);

  // single tab
  const [filterVal, setFilterVal] = useState(-1);

  // all tab
  const [selectedFilter, setSelectedFilter] = useState(
    new Array(new Array(), new Array())
  );

  const [allSelectShow, setAllSelectShow] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  // const [selected, setSelected] = useState([]);
  const getFilterData = async (collection: string) => {
    const data = await getCollectionFilter(collection);
    setOrderFilterData(data?.data?.data?.filter_info);
  };
  const firstLevelSearch = async (item: any, index: number) => {
    // todo
    // const data = await getFilterData(item?.collection);
    if (collectionSelected === index) {
      setCollectionSelected(0);
      return;
    }
    console.log(item, index);
    setCollectionSelected(index);
    getFilterData(item?.collection);
    search(item?.collection, "collection");
  };
  const closeAllSearch = () => {
    setFilterSearch(false);
    setOrderSearch(false);
    setAllSelectShow(false);
    setShowSaleSearch(false);
    setFilterVal(-1);
  };
  if (data?.length && !firstTime) {
    setFirstTime(true);
    // @ts-ignore
    getFilterData(data?.[collectionSelected]?.collection);
  }
  const getAllSelectedLength = () => {
    const length = selectedFilter?.[collectionSelected]?.map(
      (item: any, index: number) => {
        return item?.filter((item: boolean) => item)?.length;
      }
    );
    return length.filter((item) => item)?.length;
  };
  const getFilterLength = (index: number) => {
    return (
      selectedFilter?.[collectionSelected]?.[index]?.filter(
        (item: boolean) => item
      )?.length || 0
    );
  };

  // const searchList = () => {
  //   const param: any[] = [];
  //   selectedFilter?.[collectionSelected].map(
  //     (item2: object, index2: number) => {
  //       if (getFilterLength(index2)) {
  //         const filter: any = orderFilterData[index2];
  //         param.push({
  //           filter_name: filter?.filter_name,
  //           filter_type: filter?.filter_type,
  //           filter_value: filter?.filter_value,
  //         });
  //       }
  //     }
  //   );
  //   search(param, "filter");
  // };

  const updateSort = (array: any) => {
    const data = JSON.parse(JSON.stringify(orderFilterData));
    data.map((item: any, index: number) => {
      item.selectedCount =
        array?.[collectionSelected]?.[index]?.filter((item: boolean) => item)
          ?.length || 0;
    });
    const sortData = data.sort((a: any, b: any) => {
      if (!a.selectedCount) a.selectedCount = 0;
      if (!b.selectedCount) b.selectedCount = 0;
      return b.selectedCount - a.selectedCount;
    });

    setOrderFilterData(sortData);
    const sortArray = array[collectionSelected].sort((a: any, b: any) => {
      const length1 =
        a?.filter((item: any) => {
          return item;
        })?.length || 0;
      const length2 =
        b?.filter((item: any) => {
          return item;
        })?.length || 0;
      return length2 - length1;
    });
    array[collectionSelected] = JSON.parse(JSON.stringify(sortArray));
    // console.log(sortData, "orderFilterData");
    // console.log(array, "selectedFilter");
    setSelectedFilter(JSON.parse(JSON.stringify(array)));
    return sortData;
  };

  useEffect(() => {
    if (mounted) return

    const allNFTsIndex = 2

    search((allNFTsIndex + 1) % 3, "sale");
    setSaleSearchVal(allNFTsIndex);
    setOrderSearch(false);
    setShowSaleSearch(false);

    mounted = true

    return () => {
      mounted = true
    }
  }, [])


  
  return (
    <div id="filter" style={{ ...style }}>
      <div className={styles.filter}>
        {data?.length > 1 && (
          <p className={styles.first_level_search}>
            {data?.length
              ? data.map((item: any, index: number) => {
                  return (
                    <span
                      key={item?.collection_name}
                      className={
                        collectionSelected === index ? styles.selected : ""
                      }
                      onClick={() => {
                        firstLevelSearch(item, index);
                      }}
                    >
                      {item?.collection_name}
                    </span>
                  );
                })
              : ""}
          </p>
        )}
        <div className={styles.secondary_search}>
          <p className={styles.secondary_search_nav}>
            {data?.[collectionSelected] && (
              <span
                className={showSaleSearch ? styles.selected : ""}
                onClick={() => {
                  closeAllSearch();
                  setShowSaleSearch(!showSaleSearch);
                }}
              >
                {["For sale", "Not for sale", "All"][saleSearchVal]}
                <img
                  src={
                    !showSaleSearch
                      ? "/images/icon/arrorw/icon_arrow_down_black.svg"
                      : "/images/icon/arrorw/icon_arrow_up.svg"
                  }
                  alt=""
                />
              </span>
            )}
            {/* @ts-ignore */}
            {data?.[collectionSelected]?.collection_orders?.length ? (
              <span
                className={orderSearch ? styles.selected : ""}
                onClick={() => {
                  closeAllSearch();
                  setOrderSearch(!orderSearch);
                }}
              >
                {
                  // @ts-ignore
                  data?.[collectionSelected]?.collection_orders?.[
                    orderSearchVal
                  ]?.order_desc
                }
                <img
                  src={
                    !orderSearch
                      ? "/images/icon/arrorw/icon_arrow_down_black.svg"
                      : "/images/icon/arrorw/icon_arrow_up.svg"
                  }
                  alt=""
                />
              </span>
            ) : (
              ""
            )}
            {orderFilterData?.length ? (
              <span
                className={filterSearch ? styles.selected : ""}
                onClick={() => {
                  closeAllSearch();
                  setFilterSearch(!filterSearch);
                }}
                style={{
                  color: getAllSelectedLength() ? "#386EEC" : "",
                }}
              >
                Filter
                {getAllSelectedLength() ? `(${getAllSelectedLength()})` : ""}
                <img
                  src={
                    !filterSearch
                      ? "/images/icon/arrorw/icon_arrow_down_black.svg"
                      : "/images/icon/arrorw/icon_arrow_up.svg"
                  }
                  alt=""
                />
              </span>
            ) : (
              ""
            )}
          </p>
          {orderSearch &&
            // @ts-ignore
            data?.[collectionSelected]?.collection_orders?.length && (
              <div
                className={styles.secondary_search_modal}
                style={{
                  marginTop: "0px",
                }}
              >
                {
                  // @ts-ignore
                  data?.[collectionSelected]?.collection_orders.map(
                    (item: any, index: number) => {
                      return (
                        <p
                          key={item?.order_field}
                          className={`${styles.secondary_search_modal_item} ${
                            orderSearchVal === index
                              ? styles.secondary_search_modal_item_selected
                              : ""
                          }`}
                          onClick={() => {
                            search(
                              {
                                order_by: item?.order_field,
                                desc: item?.desc,
                              },
                              "order"
                            );
                            setOrderSearchVal(index);
                            setOrderSearch(false);
                          }}
                        >
                          {item?.order_desc}
                          {orderSearchVal === index && (
                            <img src="/icon_choose.svg" alt="" />
                          )}
                        </p>
                      );
                    }
                  )
                }
              </div>
            )}
          {showSaleSearch && (
            <div
              className={styles.secondary_search_modal}
              style={{
                marginTop: "0px",
              }}
            >
              {
                // @ts-ignore
                ["For sale", "Not for sale", "All"].map(
                  (item: any, index: number) => {
                    return (
                      <p
                        key={item?.order_field}
                        className={`${styles.secondary_search_modal_item} ${
                          saleSearchVal === index
                            ? styles.secondary_search_modal_item_selected
                            : ""
                        }`}
                        onClick={() => {
                          console.log(
                            (index + 1) % 3,
                            ["For sale", "Not for sale", "All"][index]
                          );
                          search((index + 1) % 3, "sale");
                          setSaleSearchVal(index);
                          setOrderSearch(false);
                          setShowSaleSearch(false);
                        }}
                      >
                        {item}
                        {saleSearchVal === index && (
                          <img src="/icon_choose.svg" alt="" />
                        )}
                      </p>
                    );
                  }
                )
              }
            </div>
          )}
          {filterVal !== -1 &&
            // @ts-ignore
            orderFilterData?.[filterVal]?.filter_value?.length && (
              <div
                className={styles.secondary_search_modal}
                style={{
                  borderRadius: "0px",
                  padding: "10px 0px 0px",
                }}
              >
                {/* filter四级导航 */}
                {/* @ts-ignore */}
                {orderFilterData?.[filterVal]?.filter_value?.map(
                  (item: string, index: number) => {
                    return (
                      <p
                        key={item}
                        className={`${styles.secondary_search_modal_item} ${
                          filterSearchval[index]
                            ? styles.tertiary_search_modal_item_selected
                            : ""
                        }`}
                        onClick={() => {
                          let array: any = [...filterSearchval];
                          array[index] = !array[index];
                          setFilterSearchval(array);
                        }}
                      >
                        {item}
                        {filterSearchval[index] && (
                          <img src="/icon_choose.svg" alt="" />
                        )}
                      </p>
                    );
                  }
                )}
                <p className={`${styles.secondary_search_modal_bottons}`}>
                  <span
                    onClick={() => {
                      setFilterSearchval([]);
                    }}
                  >
                    Clear All
                  </span>
                  <span
                    onClick={() => {
                      const array: any = [...selectedFilter];
                      array[collectionSelected][filterVal] = filterSearchval;
                      const data = updateSort(array);
                      array[collectionSelected].sort((a: number, b: number) => {
                        // let length1 = a?.length || 0;
                        // let length2 = b?.length || 0;
                        // return length2 - length1;
                        const length1 =
                          // @ts-ignore
                          a?.filter((item: any) => {
                            return item;
                          })?.length || 0;
                        const length2 =
                          // @ts-ignore
                          b?.filter((item: any) => {
                            return item;
                          })?.length || 0;
                        console.log(a, length1, "a");
                        console.log(b, length2, "b");
                        return length2 - length1;
                      });
                      setSelectedFilter(array);
                      let param: any[] = [];
                      array[collectionSelected].map(
                        (item: any, index: number) => {
                          if (item?.length) {
                            const filter = data?.[index];
                            const filter_value = filter?.filter_value?.filter(
                              (item2: string, index2: number) => {
                                if (array[collectionSelected][index][index2]) {
                                  return item2;
                                }
                              }
                            );
                            filter_value?.length &&
                              param.push({
                                filter_name: filter?.filter_name,
                                filter_type: filter?.filter_type,
                                filter_value: filter_value,
                              });
                          }
                        }
                      );
                      search(param, "filter");
                      setFilterVal(-1);
                    }}
                  >
                    Apply
                  </span>
                </p>
              </div>
            )}
          {allSelectShow && orderFilterData?.length && (
            <div
              className={styles.secondary_search_modal}
              style={{
                // borderRadius: "0px",
                padding: "10px 0px 10px",
                marginTop: "46px",
              }}
            >
              {/* filter四级导航 */}
              {orderFilterData?.map((item: any, index: number) => {
                return (
                  <p
                    key={index}
                    className={`${styles.secondary_search_modal_item} ${
                      getFilterLength(index)
                        ? styles.tertiary_search_modal_item_selected
                        : ""
                    }`}
                    onClick={(e) => {
                      // const array = [...selectedFilter];
                      // const length =
                      //   // @ts-ignore
                      //   orderFilterData[index]?.filter_value?.length;
                      // // if (getFilterLength(index) < length) {
                      // if (!getFilterLength(index)) {
                      //   array[collectionSelected][index] = new Array(
                      //     length
                      //   ).fill(true);
                      // } else {
                      //   array[collectionSelected][index] = [];
                      // }
                      // updateSort(array);
                      // array[collectionSelected].sort((a: [], b: []) => {
                      //   // let length1 = a?.length || 0;
                      //   // let length2 = b?.length || 0;
                      //   const length1 =
                      //     a?.filter((item: any) => {
                      //       return item;
                      //     })?.length || 0;
                      //   const length2 =
                      //     b?.filter((item: any) => {
                      //       return item;
                      //     })?.length || 0;
                      //   return length2 - length1;
                      //   // return length2 - length1;
                      // });
                      // setSelectedFilter(JSON.parse(JSON.stringify(array)));
                      // searchList();
                      setAllSelectShow(false);
                      setFilterVal(index);
                    }}
                  >
                    {item?.filter_name}
                    {getFilterLength(index)
                      ? `(${getFilterLength(index)})`
                      : ""}
                    {/* ({item?.filter_value?.length || 0}) */}
                    {getFilterLength(index) ? (
                      <img src="/icon_choose.svg" alt="" />
                    ) : (
                      ""
                    )}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        {/* filter三级导航 */}
        {filterSearch && orderFilterData?.length && (
          <p
            className={styles.tertiary_search}
            style={{
              marginTop: "0px",
            }}
          >
            <p className={styles.tertiary_container}>
              {
                // !allSelectShow
                //  &&
                orderFilterData?.map((item: any, index: number) => {
                  return (
                    <span
                      key={item?.filter_name}
                      className={filterVal === index ? styles.selected : ""}
                      onClick={() => {
                        if (filterVal === index) {
                          setFilterVal(-1);
                          return;
                        }
                        if (selectedFilter?.[collectionSelected]?.[index]) {
                          setFilterSearchval(
                            JSON.parse(
                              JSON.stringify(
                                selectedFilter?.[collectionSelected]?.[index]
                              )
                            )
                          );
                        } else {
                          setFilterSearchval([]);
                        }
                        setFilterVal(index);
                      }}
                      style={
                        item?.selectedCount
                          ? {
                              color: "#386EEC",
                              background: "rgba(56, 110, 236, 0.1)",
                            }
                          : {}
                      }
                    >
                      {item?.filter_name}
                      {item?.selectedCount ? `(${item?.selectedCount})` : ""}
                      <img
                        src={
                          filterVal !== index
                            ? "/images/icon/arrorw/icon_arrow_down_black.svg"
                            : "/images/icon/arrorw/icon_arrow_up.svg"
                        }
                        style={{
                          opacity: 0.4,
                        }}
                        alt=""
                      />
                    </span>
                  );
                })
              }
              <span
                className={styles.all_select}
                onClick={() => {
                  if (
                    orderSearch ||
                    filterVal !== -1 ||
                    !orderFilterData?.length
                  ) {
                    return;
                  }
                  setOrderSearch(false);
                  setAllSelectShow(false);
                  setFilterVal(-1);
                  setAllSelectShow(!allSelectShow);
                }}
              >
                <img
                  src="/images/more.svg"
                  alt=""
                  style={{
                    display:
                      orderSearch || filterVal !== -1 || allSelectShow
                        ? "none"
                        : "block",
                  }}
                />
              </span>
            </p>
          </p>
        )}
      </div>
      {(orderSearch || filterVal !== -1 || allSelectShow || showSaleSearch) && (
        <div
          onClick={() => {
            // setOrderSearch(false);
            // setAllSelectShow(false);
            // setFilterVal(-1);
            closeAllSearch();
            if (allSelectShow) {
              setFilterSearch(true);
              // setOrderSearch(true);
              // const array: any = [...selectedFilter];
              // array[collectionSelected][filterVal] = filterSearchval;
            }
          }}
          className={styles.filter_modal}
        ></div>
      )}
      {/* <div
        style={{
          height: "20px",
          background: "#ffffff",
          borderRadius: "20px 20px 0px 0px",
          marginTop: "-1px",
        }}
      ></div> */}
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
  );
};

export default Filter;
