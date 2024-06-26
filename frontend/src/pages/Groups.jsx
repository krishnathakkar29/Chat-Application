import AppLayout from "@/components/layout/AppLayout";
import { Grid, Skeleton } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, Edit, Edit2, Pencil, PencilIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Done, Menu } from "@mui/icons-material";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/components/styles/StyledComponents";
import AvatarCard from "@/components/shared/AvatarCard";
import { samepleChats, sampleUsers } from "@/constant/sampleData";
import UserItem from "@/components/shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "@/redux/api/api";
import { useAsyncMutation, useErrors } from "@/hooks/hook";
import { LayoutLoader } from "@/components/layout/Loaders";

const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const navigateBack = () => navigate("/");

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("GroupName");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  //open add member dialog
  const [isAddMember, setIsAddMember] = useState(false);

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [addMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  useErrors([
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
    {
      isError,
      error,
    },
  ]);

  useEffect(() => {
    function handleResize(e) {
      if (window.innerWidth > 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const openAddMemberHandler = () => {
    setIsAddMember(true);
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group..", chatId)
    navigate("/groups")
    setConfirmDeleteDialog(false);
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    setIsAddMember(false);
  };

  const removeFromMainScreenMembers = (id) => {
    removeMember("Removing Member..", { chatId, userId: id });
    console.log("main user , id");
  };

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    if (selectedMembers.includes(id)) {
      const newMembers = selectedMembers.filter(
        (single) => single.toString() !== id.toString()
      );
      setSelectedMembers(newMembers);
    } else {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  const IconsBtns = (
    <>
      <div
        onClick={handleMobile}
        className="block sm:hidden fixed top-8 right-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Menu />
            </TooltipTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        onClick={navigateBack}
        className="absolute top-8 left-8 rounded-full p-1 bg-black text-white hover:bg-[rgba(0,0,0,0.7)]"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ArrowLeft />
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );

  const GroupName = (
    <>
      <div className="flex items-center justify-center gap-3 p-8">
        {isEdit ? (
          <>
            <div className="flex items-center justify-center gap-3  ">
              <input
                type="text"
                className="border-2 border-black rounded p-3 text-gray-500"
                value={groupNameUpdatedValue}
                onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
              />
              <Done onClick={updateGroupName} disabled={isLoadingGroupName} />
            </div>
          </>
        ) : (
          <>
            <p className="md:text-xl">{groupName}</p>

            <Edit2 onClick={() => setIsEdit((prev) => !prev)} />
          </>
        )}
      </div>
    </>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
        bgcolor={"bisque"}
      >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconsBtns}

        {chatId && groupName && GroupName}

        {chatId && <p className="m-2 mb-4">Members</p>}

        {chatId && (
          <div className="flex flex-col gap-3 w-full max-w-xl h-[50vh] box-border overflow-y-auto">
            {/* members */}

            {groupDetails?.data?.chat?.members?.map((i) => (
              <UserItem
                styling={{
                  padding: "1rem 2rem",
                  boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                  borderRadius: "1rem",
                }}
                key={i._id}
                user={i}
                handler={removeFromMainScreenMembers}
                isAdded
              />
            ))}
          </div>
        )}

        {chatId && (
          <div className="flex flex-col md:flex-row mt-4 gap-4">
            <Button
              className="bg-green-500 hover:bg-green-700"
              onClick={openAddMemberHandler}
            >
              Add Member
            </Button>

            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={openConfirmDeleteHandler}
            >
              {" "}
              Delete Group
            </Button>

            {/* delete group dialog */}
            <Dialog
              open={confirmDeleteDialog}
              onOpenChange={() => {
                setConfirmDeleteDialog((prev) => !prev);
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Group</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the group?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={deleteHandler}>
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConfirmDeleteDialog(false);
                    }}
                  >
                    No
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* add members dialog */}
            <Dialog
              open={isAddMember}
              onOpenChange={() => {
                setIsAddMember((prev) => !prev);
              }}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Members</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col p-4 w-full max-w-xl max-h-[70vh] overflow-y-auto">
                      {isLoading ? (
                        <Skeleton />
                      ) : (
                        <>
                          <ul className=" heyo list-none overflow-y-scroll h-full">
                            {data?.friends?.length > 0 ? (
                              data?.friends?.map((i) => (
                                <UserItem
                                  user={i}
                                  key={i._id}
                                  handler={selectMemberHandler}
                                  isAdded={selectedMembers.includes(i._id)}
                                />
                              ))
                            ) : (
                              <>
                                <p className="text-center">No Friends..</p>
                              </>
                            )}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-evenly mt-4">
                      <Button
                        className="bg-green-500 hover:bg-green-700"
                        onClick={addMemberSubmitHandler}
                      >
                        Submit Changes
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() => {
                          setIsAddMember(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Grid>

      <div>
        <Sheet
          className=""
          open={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
        >
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>Chats</SheetTitle>
              <SheetDescription>
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
              </SheetDescription>
            </SheetHeader>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Grid>
  );
};

const GroupList = ({ myGroups = [], chatId }) => {
  return (
    <>
      <div className="flex flex-col overflow-y-auto max-h-screen">
        {myGroups.length > 0 ? (
          myGroups.map((group, index) => {
            return <GroupListItem group={group} chatId={chatId} key={index} />;
          })
        ) : (
          <p className="text-center text-2xl p-4">No Groups 🙄</p>
        )}
      </div>
    </>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <>
      <Link
        to={`?group=${_id}`}
        onClick={(e) => {
          if (chatId == _id) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex items-center p-2 gap-2">
          <AvatarCard avatar={avatar} />
          <p className="md:text-xl">{name}</p>
        </div>
      </Link>
    </>
  );
});

export default Groups;
