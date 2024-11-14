import React from "react";
import Header from "./Header";
import ProfileCard from "../specific/ProfileCard";
import { useMyChatsQuery } from "@/redux/api/api";
import { Drawer, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "@/redux/reducers/miscSlice";

function AppLayout({ children, user, chatId }) {
  const dispatch = useDispatch();
  const { isMobile } = useSelector((state) => state.misc);

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const { data, isError, error, isLoading, refetch } = useMyChatsQuery();

  const handleDeleteChat = () => {};
  const newMessagesAlert = () => {};

  return (
    <>
      <Header />

      {isLoading ? (
        <Skeleton />
      ) : (
        <Drawer open={isMobile} onClose={handleMobileClose}>
          <ChatList
            w="70vw"
            chats={data?.chats}
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessagesAlert}
          />
        </Drawer>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 h-[calc(100vh-4rem)]">
        <div className="hidden sm:block sm:col-span-1 md:col-span-1 h-full">
          {isLoading ? (
            <>
              <Skeleton />
            </>
          ) : (
            <>
              <ChatList
                chatId={chatId}
                chats={data?.chats}
                handleDeleteChat={handleDeleteChat}
              />
            </>
          )}
          {/* <ChatList chatId={chatId} user={user} /> */}
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 h-full">
          {children}
        </div>

        <div className="hidden md:block md:col-span-1 h-full bg-gray-900 text-white p-8">
          <ProfileCard user={user} />
        </div>
      </div>
    </>
  );
}

export default AppLayout;
