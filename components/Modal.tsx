import React from "react";

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-4  bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
