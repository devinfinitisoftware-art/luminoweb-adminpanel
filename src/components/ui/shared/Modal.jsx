import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );

  const modalRoot = document.getElementById("modal-root") || document.body;
  return createPortal(modalContent, modalRoot);
};

export default Modal;
