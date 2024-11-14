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
import { incrementNotification } from "@/redux/reducers/chatSlice";
import { useNavigate } from "react-router-dom";
import { useErrors } from "@/hooks/useErrors";
import { getSocket } from "@/socket/Socket";
import { useSocketEvents } from "@/hooks/useSocketEvents";
function AppLayout({ children, user, chatId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile } = useSelector((state) => state.misc);
  const socket = getSocket();
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const { data, isError, error, isLoading, refetch } = useMyChatsQuery();

  const handleDeleteChat = () => {};
  const newMessagesAlert = () => {};

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotification());
  }, [dispatch]);

  const refetchListener = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const eventHandlers = {
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
  };

  useSocketEvents(socket, eventHandlers);

  useErrors([{ isError, error }]);
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
              />
            </>
          )}
          {/* <ChatList chatId={chatId} user={user} /> */}
        </Grid>

        <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
          {children}
        </Grid>

        <Grid
          item
          md={4}
          lg={3}
          height={"100%"}
          sx={{
            display: { xs: "none", md: "block" },
            padding: "2rem",
            bgcolor: "rgba(0,0,0,0.85)",
          }}
        >
          <ProfileCard user={user} />
        </Grid>
      </Grid>
    </>
  );
}

export default AppLayout;
