import React from "react";
import { Outlet } from "react-router";

import ScreenBlock from "./ScreenBlock";
import Modal from "./Modal";

const Layout = function () {
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
