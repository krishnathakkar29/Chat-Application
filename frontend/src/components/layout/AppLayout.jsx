import React, { useCallback } from "react";
import Header from "./Header";
import ProfileCard from "../specific/ProfileCard";
import { useMyChatsQuery } from "@/redux/api/api";
import { Drawer, Skeleton, Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "@/redux/reducers/miscSlice";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "@/constants/events";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "@/redux/reducers/chatSlice";
import { useNavigate } from "react-router-dom";
import { useErrors } from "@/hooks/useErrors";
import { getSocket } from "@/socket/Socket";
import { useSocketEvents } from "@/hooks/useSocketEvents";
function AppLayout({ children, user, chatId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile } = useSelector((state) => state.misc);
  const { newMessagesAlert } = useSelector((state) => state.chat);
  const socket = getSocket();
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const { data, isError, error, isLoading, refetch } = useMyChatsQuery();

  const handleDeleteChat = () => {};

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotification());
  }, [dispatch]);

  const refetchListener = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const newMessageAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    [chatId]
  );

  const eventHandlers = {
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
  };

  useSocketEvents(socket, eventHandlers);

  useErrors([{ isError, error }]);
  return (
    <>
      <Header refetch={refetch} />

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

      <Grid container height={"calc(100vh - 4rem)"}>
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}
        >
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
                newMessagesAlert={newMessagesAlert}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12} sm={8} md={9} lg={9} height={"100%"}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default AppLayout;
