import React, {useCallback, useState} from "react";
import useStore from "@src/hooks/use-store";
import LayoutModal from "@src/components/layouts/layout-modal";
import Qty from "@src/components/catalog/qty";

function AddToBasket({ onClose, callToAction }) {
  const store = useStore();

  const [amount, setAmount] = useState(1)

  const callbacks = {
    onOk: useCallback(() => onClose(amount), [amount]),
    // Количество товара
    onUp: useCallback(() => {
      setAmount(prev => prev < 99 ? prev + 1 : prev)
    }, []),
    onDown: useCallback(() => {
      setAmount(prev => prev > 1 ? prev - 1 : prev)
    }, []),
  };

  return (
    <LayoutModal  title={"Add to basket"} 
                  labelClose={"Cancel"}
                  onClose={onClose}>
      <Qty  onOk={callbacks.onOk}
            onUp={callbacks.onUp}
            onDown={callbacks.onDown}
            callToAction={callToAction}
            value={amount}
            />
    </LayoutModal>
  )
}

export default React.memo(AddToBasket);
