import {
  BellIcon,
  GroupIcon,
  LogOut,
  MenuIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  User,
  UserIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "@/redux/reducers/miscSlice";
import { Suspense, useState } from "react";
import Search from "../specific/Search";
import { resetNotificationCount } from "@/redux/reducers/chatSlice";
import { Backdrop } from "@mui/material";
import NotificationDialog from "../specific/NotificationDialog";
import NewGroupDialog from "../specific/NewGroupDialog";
import axios from "axios";
import toast from "react-hot-toast";
import { userNotExists } from "@/redux/reducers/authSlice";
import { server } from "@/config";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

function Header() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "John Doe",
    username: "johndoe",
    avatar: "https://github.com/shadcn.png",
  });

  const { user } = useSelector((state) => state.auth);
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => {};

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

  const profileUpdate = async () => {
    const toastId = toast.loading("Logging In...");
    setLoading(true);

    try {
      const { data } = await axios.put(`${server}/api/v1/user/update-profile`, {
        name: newUser.username,
        username: newUser.username,
      });

      toast.success(data?.message, {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (field, value) => {
    setNewUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  console.log(user.avatar);
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

          <Drawer>
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
                  <DrawerTitle>Edit Profile</DrawerTitle>
                  <DrawerDescription>
                    Make changes to your profile here.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar.url} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          handleUserUpdate("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) =>
                          handleUserUpdate("username", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Save changes</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
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
