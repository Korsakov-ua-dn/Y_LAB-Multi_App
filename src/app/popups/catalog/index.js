import React, {useCallback, useEffect, useLayoutEffect} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import LayoutModal from "@src/components/layouts/layout-modal";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import ItemPopup from "@src/components/catalog/item-popup";

function PopupCatalog({ onClose, fromCart }) {
  const store = useStore();
  const {t} = useTranslate();

  const select = useSelector(state => ({
    selected: state.basket.selected,
  }));

  const callbacks = {
    // Выделение товара с добавлением в корзину
    onSelect: useCallback((_id) => {
      store.get('basket').selectItem(_id)
      store.get('basket').addToBasket(_id)
    }, []),
  };

  const renders = {
    item: useCallback(item => (
      <ItemPopup
        item={item}
        onSelect={callbacks.onSelect}
        selected={select.selected}
      />
    ), [select.selected?.length]),
  }

  PopupCatalog.id = 1
  const stateName = `catalog-${PopupCatalog.id++}`

  useLayoutEffect(() => {
    store.createState(stateName, 'catalog')
    store.get(stateName).setParams()
    return () => { 
      store.deleteState(stateName)
      store.get('catalog').setParams()
      fromCart && store.get('basket').unselectAll()
    }
  }, [])

  return (
    <LayoutModal  title={"Модалка каталога"} 
                  labelClose={"Закрыть"}
                  onClose={onClose}>
      <CatalogFilter stateName={stateName} />
      <CatalogList stateName={stateName} renderFunc={fromCart ? renders.item : null}/>
    </LayoutModal>
  )
}

export default React.memo(PopupCatalog);
