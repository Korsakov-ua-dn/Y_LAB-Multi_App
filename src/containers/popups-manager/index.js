import React, { useEffect } from "react";

import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";

import { Popups } from "@src/const";

import Basket from "@src/app/popups/basket";
import AddToBasket from "@src/app/popups/add-to-basket";
import Catalog from "@src/app/popups/catalog";
import { useLocation } from "react-router-dom";

const popups = {
  [Popups.BASKET]: Basket,
  [Popups.ADDTOBASKET]: AddToBasket,
  [Popups.CATALOG]: Catalog,
};

const PopupsManager = () => {
  const store = useStore();
  const pathname = useLocation().pathname

  const select = useSelector(state => ({
    modals: state.modals.modals,
  }));

  useEffect(() => store.get('modals').closeAll(), [pathname])

  return select.modals.map((mountedPopup) => {
    const Component = popups[mountedPopup.name];

    if (!Component) {
      return null;
    }

    return (
      <Component  key={mountedPopup.name}
                  {...mountedPopup}
                  />
    );
  });
};

export default PopupsManager;
