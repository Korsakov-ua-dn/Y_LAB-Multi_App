import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import BasketTotal from "@src/components/catalog/basket-total";
import LayoutModal from "@src/components/layouts/layout-modal";
import ItemBasket from "@src/components/catalog/item-basket";
import List from "@src/components/elements/list";
import { Popups } from "@src/const";
import OpenCatalog from "@src/components/catalog/open-catalog";

function Basket({ onClose }) {
  const store = useStore();

  const select = useSelector(state => ({
    items: state.basket.items,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.get('basket').removeFromBasket(_id), []),
    // Открытие модалки с каталогом
    openModalCatalog: useCallback(() => {
      const popupObj = {
        name: Popups.CATALOG,
        fromCart: true,
        onClose: () => store.get('modals').close(popupObj),
      }
      store.get('modals').open(popupObj);
    }, []),
  };

  const renders = {
    itemBasket: useCallback(item => (
      <ItemBasket
        item={item}
        link={`/articles/${item._id}`}
        onRemove={callbacks.removeFromBasket}
        onLink={onClose}
        labelUnit={t('basket.unit')}
        labelDelete={t('basket.delete')}
      />
    ), []),
  }

  return (
    <LayoutModal title={t('basket.title')} labelClose={t('basket.close')}
                 onClose={onClose}>
      <List items={select.items} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
      <OpenCatalog onOpen={callbacks.openModalCatalog}/>
    </LayoutModal>
  )
}

export default React.memo(Basket);
