import React from "react";
import moment from "moment";
import { Calendar, User2Icon, UserRoundPen } from "lucide-react";
import { transformImage } from "@/lib/features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfileCard = ({ user }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Avatar className="h-48 w-48 border-2 border-white">
        <AvatarImage
          src={transformImage(user?.avatar?.url)}
          alt={user?.name}
          className="object-contain"
        />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <Profile
        heading="username"
        text={user?.username}
        Icon={<User2Icon className="h-5 w-5" />}
      />
      <Profile
        heading="name"
        text={user?.name}
        Icon={<UserRoundPen className="h-5 w-5" />}
      />
      <Profile
        heading="joined"
        text={moment(user?.createdAt).fromNow()}
        Icon={<Calendar className="h-5 w-5" />}
      />
    </div>
  );
};

const Profile = ({ text, Icon, heading }) => {
  return (
    <div className="flex items-center justify-center gap-4 mx-auto text-white ">
      {Icon && Icon}

      <div className="flex flex-col items-center">
        <p className="text-white">{text}</p>
        <p className="text-gray-500">{heading}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
