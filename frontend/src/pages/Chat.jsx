import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Chat() {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const { chatId } = params;

  return (
    <AppLayout user={user} chatId={chatId}>
      <div>Chat</div>
    </AppLayout>
  );
}

export default Chat;
