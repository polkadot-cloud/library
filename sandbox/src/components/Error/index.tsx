import "../../styles/app.scss";
import IconSVG from "../../svg/icon.svg?react";

export const Error = () => {
  return (
    <div className="error-page">
      <div className="icon">
        <IconSVG />
      </div>
      <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Oops!</h2>
      <h4>Something went wrong! You are not supposed to be here.</h4>
      <a href="/">Go Back</a>
    </div>
  );
};
