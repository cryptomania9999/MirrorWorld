import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/loader.module.less";

const Loader: NextPage = () => {
  return (
    <div className={styles.loader}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Loader;
