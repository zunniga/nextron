// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalExit: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <dialog open={isOpen} className="modal backdrop-blur">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">¿Estás seguro que deseas salir?</h3>
        <p>Se eliminaran todos los certificados generados.</p>
        <div className="modal-action">
          <button className="btn btn-error text-white" onClick={onConfirm}>
            Sí ☠️
          </button>
          <button className="btn" onClick={onClose}>
            No
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default ModalExit;
