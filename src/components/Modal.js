import React from "react";

const Modal = function (props) {
  function handleButton(event) {
    event.preventDefault();
    props.buttonFunc();
    props.closeFunc();
  }

  return props.show ? (
    <div className="modalWrapper flexCenter" onClick={props.closeFunc}>
      <div
        className="modal flexCol"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flexRow modalHeader">
          <div className="flexRow flexCenter modalCloseButtonWrapper">
            <button className="modalCloseButton" onClick={props.closeFunc}>
              X
            </button>
          </div>
          <h2 className="modalTitle">{props.title}</h2>
          <div className="modalHeaderInvisibleDiv"></div>
        </div>
        <div className="modalBody flexCenter">
          <p className="modalText">{props.text}</p>
        </div>
        <div className="modalFooter flexCenter">
          <button onClick={(event) => handleButton(event)}>
            {props.buttonText}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
