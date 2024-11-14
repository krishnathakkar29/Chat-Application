import React from "react";
import Header from "./Header";
import ProfileCard from "../specific/ProfileCard";

function AppLayout({ children, user, chatId }) {
  return (
    <>
      <Header />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 h-[calc(100vh-4rem)]">
        <div className="hidden sm:block sm:col-span-1 md:col-span-1 h-full">
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
