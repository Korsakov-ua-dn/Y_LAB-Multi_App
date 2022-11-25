import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/navigation/menu";
import BasketSimple from "@src/components/catalog/basket-simple";
import LayoutFlex from "@src/components/layouts/layout-flex";
import { Popups } from "@src/const";

function ToolsContainer() {

  const store = useStore();
  // const storeRedux = useStoreRedux();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Открытие корзины
    openModalBasket: useCallback(() => {
      const popupObj = {
        name: Popups.BASKET,
        onClose: () => store.get('modals').close(popupObj)
      }
      store.get('modals').open(popupObj);
    }, []),
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: t('menu.chat'), link: '/chat'},
      {key: 3, title: t('menu.canvas'), link: '/canvas'},
    ]), [t]),
  }

  return (
    <LayoutFlex flex="between" indent="big">
      <Menu items={options.menu}/>
      <BasketSimple onOpen={callbacks.openModalBasket} 
                    amount={select.amount} 
                    sum={select.sum}
                    t={t}/>
    </LayoutFlex>
  );
}

export default React.memo(ToolsContainer);
