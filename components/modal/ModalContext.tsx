"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import styles from "./style.module.scss";

type ModalOptions = {
  content: ReactNode;
  onClose?: () => void;
};

type ModalContextType = {
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => setModal(options);
  const closeModal = () => {
    modal?.onClose?.();
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div
            className={styles.content}
            onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ✕
            </button>
            {modal.content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
