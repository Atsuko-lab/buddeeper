import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import "@/public/styles/popup.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <MdOutlineClose className="action close" onClick={onClose} />
        {children}
      </div>
    </div>
  );
};

export default Popup;
