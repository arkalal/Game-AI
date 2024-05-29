import React from "react";
import styles from "./Home.module.scss";
import GameCanvas from "../GameCanvas/GameCanvas";

const Home = () => {
  return (
    <div className={styles.Home}>
      <GameCanvas />
    </div>
  );
};

export default Home;
