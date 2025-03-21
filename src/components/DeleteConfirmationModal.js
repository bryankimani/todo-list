// components/DeleteConfirmationModal.js
import React from "react";

export const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="btn btn-ghost mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};