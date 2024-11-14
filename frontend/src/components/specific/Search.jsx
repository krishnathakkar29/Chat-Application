import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "@/redux/api/api";
import UserItem from "../common/UserItem";
import { useAsyncMutation } from "@/hooks/useAsyncMutation";

function Search({ isOpen, onOpenChange }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  const addFriendHandler = async (_id) => {
    await sendFriendRequest("Sending friend request...", { userId: _id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <h1 className="text-center text-xl">Find People</h1>
        <div className=" flex p-2 items-center duration-200 ease-linear focus-within:border-2 focus-within:border-blue-500 border-2 border-[#000]">
          <SearchIcon className="w-6 h-6" />
          <input
            type="text"
            className="flex-grow border-none outline-none w-full rounded-md text-gray-700 p-1 text-xl"
            placeholder="Search"
            value={search}
            onChange={(e) => e.target.value}
          />
        </div>
        <div className="h-[40vh]">
          <ul className=" heyo list-none overflow-y-scroll h-full">
            {users.map((item, index) => {
              return (
                <li key={item._id}>
                  <UserItem
                    user={item}
                    handler={addFriendHandler}
                    handlerIsLoading={isLoadingSendFriendRequest}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Search;
