import React, { useState } from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

import ScreenBlock from "./ScreenBlock";
import Modal from "./Modal";

export const ModalContext = React.createContext();

const Layout = function () {
  const [blockScreen, setBlockScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [modalButtonFunc, setModalButtonFunc] = useState(null);
  const [modalButtonText, setModalButtonText] = useState(null);

  const modalCloseFunc = async function (reset = true) {
    if (reset) {
      setModalText(null);
      setModalTitle(null);
      setModalButtonFunc(null);
      setModalButtonText(null);
    }
    await setShowModal(false);
    setBlockScreen(false);
  };

  //function given to ModalContext that lets components display custom modals
  function createModal(
    title,
    text,
    buttonFunc,
    buttonText,
    blockScreen = true
  ) {
    Promise.all([
      setModalTitle(title),
      setModalText(text),
      setModalButtonFunc(() => buttonFunc),
      setModalButtonText(buttonText),
    ])
      .then(async () => {
        if (blockScreen) {
          await setBlockScreen(true);
          setShowModal(true);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="layoutWrapper">
      <ScreenBlock show={blockScreen} />
      <Modal
        show={showModal}
        title={modalTitle}
        text={modalText}
        closeFunc={modalCloseFunc}
        buttonFunc={modalButtonFunc}
        buttonText={modalButtonText}
      />

      <ModalContext.Provider value={createModal}>
        <div className="layout flexCol">
          <div className="layoutHeader">
            <Link to="/">
              <h1>Blog API (Private)</h1>
            </Link>
          </div>
          <div className="layoutBody">
            <Outlet />
          </div>
          <div className="layoutFooter" />
        </div>
      </ModalContext.Provider>
    </div>
  );
};

export default Layout;
