import React, { useState } from "react";
import { Outlet } from "react-router";

import ScreenBlock from "./ScreenBlock";
import Modal from "./Modal";

const Layout = function () {
  const [blockScreen, setBlockScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [modalButtonFunc, setModalButtonFunc] = useState(null);
  const [modalButtonText, setModalButtonText] = useState(null);

  return (
    <div>
      <ScreenBlock show={blockScreen} />
      <Modal
        show={showModal}
        title={modalTitle}
        text={modalText}
        closeFunc={modalCloseFunc}
        buttonFunc={modalButtonFunc}
        buttonText={modalButtonText}
      />
      <div style={{ zIndex: 0, position: "relative" }}>
        <ModalContext.Provider value={createModal}>
          <Outlet />
        </ModalContext.Provider>
      </div>
    </div>
  );
};

export default Layout;
