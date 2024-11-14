import AppLayout from "@/components/layout/AppLayout";
import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);
  return (
    <AppLayout user={user}>
      <div className="text-center text-2xl p-8">Select a friend to chat</div>
    </AppLayout>
  );
}

export default Home;
