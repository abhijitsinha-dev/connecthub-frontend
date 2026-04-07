import { useRef, useState } from 'react';

const useImagePicker = (hasCustomImage, onChange, onRemove, field) => {
  const inputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const openPicker = () => {
    closeMenu();
    inputRef.current?.click();
  };

  const handleClick = () => {
    if (hasCustomImage) {
      setIsMenuOpen(true);
    } else {
      openPicker();
    }
  };

  const handleChange = e => {
    onChange(e, field);
    closeMenu();
  };

  const handleRemove = () => {
    onRemove();
    closeMenu();
  };

  return {
    inputRef,
    isMenuOpen,
    closeMenu,
    openPicker,
    handleClick,
    handleChange,
    handleRemove,
  };
};

export default useImagePicker;
