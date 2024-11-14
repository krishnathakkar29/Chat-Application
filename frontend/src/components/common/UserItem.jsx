import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { transformImage } from "@/lib/features";
import { Minus, Plus } from "lucide-react";

function UserItem({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) {
  const { name, _id, avatar } = user;
  return (
    <div
      className="flex items-center justify-between p-2  overflow-hidden max-w-full"
      style={{ ...styling }}
    >
      <Avatar className="h-12 w-12 border-2 border-white">
        <AvatarImage
          src={transformImage(user?.avatar?.url)}
          alt={user?.name}
          className="object-contain"
        />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <p
        className=" flex-grow text-left ml-4 text-ellipsis overflow-hidden "
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        {name}
      </p>

      <button
        className={`rounded-full ${
          isAdded ? "bg-red-600" : "bg-blue-600"
        }  text-white p-3`}
        onClick={() => handler(_id)}
        disabled={handlerIsLoading}
      >
        {isAdded ? <Minus /> : <Plus />}
      </button>
    </div>
  );
}

export default UserItem;
