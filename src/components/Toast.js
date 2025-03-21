// components/Toast.js
import React from "react";

export const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast toast-top toast-center">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          &times;
        </button>
      </div>
    </div>
  );
};