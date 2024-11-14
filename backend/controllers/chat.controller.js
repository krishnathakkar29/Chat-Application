import {
  ALERT,
  REFETCH_CHATS
} from "../constants/events.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { AsyncHandler, emitEvent, ErrorHandler } from "../utils/utils.js";


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

  return res.status(200).json({
    success: true,
    message: "My Chats",
    chats: transformedChats,
  });
});

const getMessages = AsyncHandler(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const resultPerPage = 20;
  const skip = (page - 1) * resultPerPage;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.members.includes(req.user.toString()))
    return next(
      new ErrorHandler("You are not allowed to access this chat", 403)
    );

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

const getChatDetails = AsyncHandler(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const deleteChat = AsyncHandler(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not allowed to delete the group", 403)
    );

  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete the chat", 403)
    );
  }

  //   Here we have to dete All Messages as well as attachments or files from cloudinary
  await Promise.all([chat.deleteOne(), Message.deleteMany({ chat: chatId })]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const newGroupChat = AsyncHandler(async (req, res, next) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];

  if (members.length < 2) {
    return next(new ErrorHandler("There must be more than 3 members", 401));
  }

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});

export { deleteChat, getChatDetails, getMessages, getMyChats, newGroupChat };

