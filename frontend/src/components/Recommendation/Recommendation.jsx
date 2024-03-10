import React from "react";
import css from "./Recommendations.module.css";
import RecommendationSlider from "../RecommendationSlider/RecommendationSlider";
import Plane from "../../assets/plane.png";

const Recommendation = () => {
  return (
    <>
      <div className={css.container}>
        <img src={Plane} alt="" />
        <h1>Recommendations</h1>
      </div>
      <div className={css.products}>
        <RecommendationSlider />
      </div>
    </>
  );
};

export default Recommendation;
