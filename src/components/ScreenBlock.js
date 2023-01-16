import React from "react";

const ScreenBlock = function (props) {
  return props.show ? <div className="screenBlock"></div> : null;
};

export default ScreenBlock;
