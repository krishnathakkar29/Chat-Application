import { Chat } from "../models/chat.model.js";
import { AsyncHandler } from "../utils/utils.js";

export const getOtherMember = (members, userId) => {
  return members.find(({ _id }) => _id.toString() != userId.toString());
};

const getMyChats = AsyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
  }).populate("members", "name avatar");

  const transformedChats = chats.map(
    ({ _id, groupChat, creator, name, members }) => {
      const otherMember = getOtherMember(members, req.user);

      return {
        _id,
        name: groupChat ? name : otherMember.name,
        groupChat,
        creator,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() != req.user.toString()) {
            prev.push(curr._id.toString());
          }
          return prev;
        }, []),
        avatar: groupChat
          ? members.slice(0, 3).map((member) => {
              return member.avatar.url;
            })
          : [otherMember.avatar.url],
      };
    }
  );

  console.log(transformedChats)
  return res.status(200).json({
    success: true,
    message: "My Chats",
    chats: transformedChats,
  });
});

export { getMyChats };
