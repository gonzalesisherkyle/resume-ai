import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/common/Modal';
import FormModal from '../components/common/FormModal';

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

  const [formModalConfig, setFormModalConfig] = useState({
    isOpen: false,
    title: '',
    fields: [],
    resolve: null,
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

  const showFormModal = useCallback((title, fields) => {
    return new Promise((resolve) => {
      setFormModalConfig({
        isOpen: true,
        title,
        fields,
        resolve,
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

  const handleFormSubmit = (data) => {
    if (formModalConfig.resolve) formModalConfig.resolve(data);
    setFormModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleFormCancel = () => {
    if (formModalConfig.resolve) formModalConfig.resolve(null);
    setFormModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ alert: showAlert, confirm: showConfirm, formModal: showFormModal }}>
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

      <Modal
        isOpen={formModalConfig.isOpen}
        title={formModalConfig.title}
        onClose={handleFormCancel}
      >
        <FormModal
          fields={formModalConfig.fields}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
