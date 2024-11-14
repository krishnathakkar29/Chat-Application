import MessageComponent from "@/components/common/MessageComponent";
import AppLayout from "@/components/layout/AppLayout";
import { InputBox } from "@/components/styles/StyledComponents";
import { getSocket } from "@/socket/Socket";
import { Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteScrollTop } from "6pp";
import { useChatDetailsQuery, useGetMessagesQuery } from "@/redux/api/api";
import { useErrors } from "@/hooks/useErrors";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { ALERT, NEW_MESSAGE } from "@/constants/events";
import { Skeleton } from "@mui/material";

function Chat() {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const { chatId } = params;
  const containerRef = useRef();
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });

    setMessage("");
  };

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      console.log(data);
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    // [START_TYPING]: startTypingListener,
    // [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <AppLayout user={user} chatId={chatId}>
      <div
        ref={containerRef}
        className="flex flex-col gap-1 h-[90%] box-border overflow-y-auto overflow-x-hidden p-4 bg-gray-200"
      >
        {allMessages?.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
      </div>

      <form
        action=""
        className="h-[10%] flex items-center p-2 relative"
        onSubmit={submitHandler}
      >
        <InputBox
          placeholder="Type your message here..."
          value={message}
          onChange={messageOnChange}
        />

        <div
          className={` bg-[#ea7070] rounded-full  w-8 h-8 flex items-center justify-center text-white`}
          style={{
            transform: "rotate(40deg)",
          }}
        >
          <Send className="" />
        </div>
      </form>
    </AppLayout>
  );
}

export default Chat;
