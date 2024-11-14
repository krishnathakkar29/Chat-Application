import moment from "moment";
import React, { memo } from "react";

const MessageComponent = ({ message, user }) => {
  const { sender, attachments = [], content, createdAt } = message;

  const sameSender = sender._id.toString() == user?._id.toString();
  console.log(sameSender);
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <p className="text-sm text-blue-400 font-normal">{sender.name}</p>
      )}
      {content && <p>{content}</p>}

      {/* {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <div key={index}>
              <a
                href=""
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </div>
          );
          1;
        })} */}

      <p className="text-[0.8rem] text-gray-500">
        {moment(createdAt).fromNow()}
      </p>
    </div>
  );
};

export default memo(MessageComponent);
