import React from "react";

import "@/public/styles/toast.css";
import { MdOutlineClose } from "react-icons/md";

interface ToastProps {
  message: string;
  type: string;
  id: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, id, onClose }) => {
  return (
    <div className={`toast ${type}`} id={`toast-${id}`}>
      <p>{message}</p>
      <MdOutlineClose onClick={() => onClose(id)} />
    </div>
  );
};

export default Toast;
