import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/common/Modal';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'CANCEL',
    resolve: null,
    isConfirm: false
  });

  const showAlert = useCallback((message, title = 'SYSTEM_ALERT') => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        title,
        message,
        confirmText: 'ACKNOWLEDGE',
        cancelText: '',
        resolve,
        isConfirm: false
      });
    });
  }, []);

  const showConfirm = useCallback((message, title = 'CONFIRM_ACTION') => {
    return new Promise((resolve) => {
      setModalConfig({
        isOpen: true,
        title,
        message,
        confirmText: 'PROCEED',
        cancelText: 'ABORT',
        resolve,
        isConfirm: true
      });
    });
  }, []);

  const handleClose = () => {
    if (modalConfig.resolve) modalConfig.resolve(false);
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (modalConfig.resolve) modalConfig.resolve(true);
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ alert: showAlert, confirm: showConfirm }}>
      {children}
      <Modal 
        isOpen={modalConfig.isOpen} 
        title={modalConfig.title}
        onClose={handleClose}
        footer={
          <div className="flex gap-3">
            {modalConfig.isConfirm && (
              <button 
                onClick={handleClose}
                className="btn-terminal text-[10px]"
              >
                {modalConfig.cancelText}
              </button>
            )}
            <button 
              onClick={handleConfirm}
              className={`btn-terminal ${modalConfig.isConfirm ? 'btn-terminal-primary' : ''} text-[10px]`}
            >
              {modalConfig.confirmText}
            </button>
          </div>
        }
      >
        <div className="flex gap-4 items-start">
          <span className="text-[var(--terminal-accent)] font-bold">{'>'}</span>
          <p className="text-[var(--terminal-text)]">{modalConfig.message}</p>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
