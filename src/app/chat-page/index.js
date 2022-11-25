import React, { useLayoutEffect } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import Chat from "@src/containers/chat";

function ChatPage(){
  const store = useStore();

  const select = useSelector(state => ({
    isAuth: state.chat.isAuth,
    token: state.session.token,
  }));

  useLayoutEffect(() => {
    store.get('chat').connect(select.token)
    return () => store.get('chat').disconnect()
  }, [])

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer/>
      <ToolsContainer/>
      { select.isAuth && <Chat/> }
    </Layout>
  )
}

export default React.memo(ChatPage);
