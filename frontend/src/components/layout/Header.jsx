import {
  BellIcon,
  GroupIcon,
  MenuIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "@/redux/reducers/miscSlice";
import { Suspense } from "react";
import Search from "../specific/Search";

function Header() {
  const { isSearch } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const handleMobile = () => {};
  const openSearch = () => {
    dispatch(setIsSearch(!isSearch));
  };
  const openNewGroup = () => {};
  const navigateToGroups = () => {};
  const openNotification = () => {};
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
            text={"Creat Group"}
            icon={<PlusIcon />}
            onClick={openNewGroup}
          />
          {/* <HeaderOption
            text={"Groups"}
            icon={<GroupIcon />}
            onClick={navigateToGroups}
          /> */}
          <HeaderOption
            text={"Notifications"}
            icon={<BellIcon />}
            onClick={openNotification}
            boolean={true}
            notificationCount={4}
          />
        </div>
      </header>
      {isSearch && (
        <Suspense fallback={<div>Loading Search....</div>}>
          <Search isOpen={isSearch} onOpenChange={openSearch} />
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
