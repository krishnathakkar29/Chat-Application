import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { server } from "@/config";
import { userNotExists } from "@/redux/reducers/authSlice";
import { resetNotificationCount } from "@/redux/reducers/chatSlice";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "@/redux/reducers/miscSlice";
import { Backdrop } from "@mui/material";
import axios from "axios";
import {
  BellIcon,
  LogOut,
  MenuIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";

const Search = lazy(() => import("../specific/Search"));
const NewGroupDialog = lazy(() => import("../specific/NewGroupDialog"));
const NotificationDialog = lazy(() => import("../specific/NotificationDialog"));

function Header({ refetch }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: user.name,
    username: user.username,
    avatar: user.avatar.url,
  });

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => {
    dispatch(setIsSearch(!isSearch));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(!isNewGroup));
  };

  const openNotification = () => {
    dispatch(setIsNotification(!isNotification));
    dispatch(resetNotificationCount());
  };

  const logoutHandler = async () => {
    const toastId = toast.loading("Logging In...");

    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch(userNotExists());

      toast.success(data?.message, {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <header className="flex items-center justify-between h-16 bg-gray-900 text-white px-4 md:px-6">
        <div className="hidden sm:flex items-center gap-2">
          <MessageCircleIcon className="h-6 w-6" />
          <span className="text-lg font-medium">Chat App</span>
        </div>
        <div className="sm:hidden flex  items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:bg-white hover:text-gray-800"
                  onClick={handleMobile}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Menu Icon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <HeaderOption
            text={"Search"}
            icon={<SearchIcon />}
            onClick={openSearch}
          />
          <HeaderOption
            text={"Create Group"}
            icon={<PlusIcon />}
            onClick={openNewGroup}
          />
          <HeaderOption
            text={"Notifications"}
            icon={<BellIcon />}
            onClick={openNotification}
            boolean={true}
            notificationCount={notificationCount}
          />
          <HeaderOption
            text={"Logout"}
            icon={<LogOut />}
            onClick={logoutHandler}
          />

          {/* <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:bg-white hover:text-gray-800"
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Your Profile</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar.url} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h2>{user.name}</h2>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-center text-muted-primary text-xl ">{user.username}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer> */}

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:bg-white hover:text-gray-800 transition-colors duration-200"
              >
                <UserIcon className="h-5 w-5" />
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader className="text-center">
                  <DrawerTitle className="text-2xl font-semibold">
                    Your Profile
                  </DrawerTitle>
                </DrawerHeader>

                <div className="p-4 pb-8">
                  <div className="flex items-center justify-center mb-6">
                    <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-gray-200">
                      <AvatarImage
                        src={user.avatar.url}
                        alt={user.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <label className="text-sm text-gray-500 block mb-1">
                        Full Name
                      </label>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user.name}
                      </h2>
                    </div>
                    <div className="text-center">
                      <label className="text-sm text-gray-500 block mb-1">
                        Username
                      </label>
                      <h2 className="text-xl text-gray-600">
                        @{user.username}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search isOpen={isSearch} onOpenChange={openSearch} />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog
            isOpen={isNotification}
            onOpenChange={openNotification}
          />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog isOpen={isNewGroup} onOpenChange={openNewGroup} />
        </Suspense>
      )}
    </>
  );
}

const HeaderOption = ({
  text,
  onClick,
  icon,
  boolean = false,
  notificationCount = 0,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-white hover:text-gray-800"
              onClick={onClick}
            >
              {icon}
            </Button>
            {boolean && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {notificationCount}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Header;
