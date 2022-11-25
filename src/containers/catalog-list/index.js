import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import { Popups } from "@src/const";

function CatalogList({ stateName = "catalog", renderFunc }) {

  const store = useStore();

  const select = useSelector(state => ({
    items: state[stateName]?.items,
    page: state[stateName]?.params.page,
    limit: state[stateName]?.params.limit,
    count: state[stateName]?.count,
    waiting: state[stateName]?.waiting,
    query: state[stateName]?.params.query,
    category: state[stateName]?.params.category,
    selected: state.basket.selected,
  }));

  const {t} = useTranslate();
  const intObserver = useRef()

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback( _id => {
      const callToAction = "Укажите количество товара, которое необходимо добавить"
      const popupObj = {
        name: Popups.ADDTOBASKET, 
        callToAction,
        onClose: (amount) => {
          store.get('modals').close(popupObj)
          amount && store.get('basket').addToBasket(_id, amount)
        },
      }
      store.get('modals').open(popupObj)
    }, []),

    // Пагианция
    onPaginate: useCallback(page => store.get(stateName).setParams({page}), []),

    // Подгрузка следующей порции
    onNextPortion: useCallback((page) => store.get(stateName)?.loadArticlesPortion({page}), []),

    // Бесконечный скролл
    lastItemRef: useCallback(item => {
      if (select.waiting) return
      if(select.items?.length >= select.count) return
      if (intObserver.current) intObserver.current.disconnect()
      intObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            setPage(prev => prev + 1)
        }
      })
      if (item) intObserver.current.observe(item)
    }, [select.waiting, select.count, select.items?.length])
  };

  const [page, setPage] = useState(select.page)

  // очистка массива items при goBack
  useLayoutEffect(() => {
    store.get(stateName)?.resetItems()
  }, [])

  useLayoutEffect(() => {
    setPage(select.page)
  }, [select.page])

  // подгрузка в стейт порции товаров со следующей страницы
  useLayoutEffect(() => {
    if (page !== 1) callbacks.onNextPortion(page)
  }, [page])

  const renders = {
    item: useCallback((item) => {
      return <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    }, [t]),
  }

  return (
    <Spinner active={select.waiting}>
      <List items={select.items} renderItem={renderFunc ? renderFunc : renders.item}/>
      <Pagination 
                  ref={callbacks.lastItemRef} 
                  count={select.count} 
                  page={select.page} 
                  limit={select.limit} 
                  onChange={callbacks.onPaginate}/>
    </Spinner>
  );
}

export default React.memo(CatalogList);
