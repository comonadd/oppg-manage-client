import { useState } from "react";

export interface ModalController {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isShown: boolean;
}
export const useModal = (): ModalController => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const open = () => setIsShown(true);
  const close = () => setIsShown(false);
  const toggle = () => setIsShown(!isShown);
  return { open, isShown, close, toggle };
};
