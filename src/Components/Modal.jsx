const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-4">{children}</div>
    </div>
  );
};

export default Modal;
