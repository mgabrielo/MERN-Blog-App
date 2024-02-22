import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Comments({ comment, handleLike, onEdit, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);
  useEffect(() => {
    function getUser() {
      try {
        axios.get(`/api/user/${comment?.userId}`).then((res) => {
          setUser(res.data?.user);
        });
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [comment?.userId]);
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSave = async () => {
    try {
      await axios
        .put(`/api/comment/editComment/${comment._id}`, {
          content: editedContent,
        })
        .then((res) => {
          if (res.data && res.status == 200) {
            setIsEditing(false);
            onEdit(comment, editedContent);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex p-3 border-b border-gray-500 dark:border-gray-300">
      <div className="flex-shrink-0 mr-2">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm font-bold mr-1 truncate">
            @{user?.username ? user.username : "Anonymous"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {moment(comment?.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              placeholder="Add your Comment..."
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              maxLength={400}
            />
            <div className="flex justify-between gap-2 items-center my-3">
              <p className="text-gray-500 dark:text-gray-200 text-sm">
                {400 - editedContent?.length} characters remaining
              </p>

              <div className="flex gap-3 items-center">
                <Button
                  type="button"
                  outline
                  gradientDuoTone={"purpleToBlue"}
                  size={"sm"}
                  onClick={handleSave}
                >
                  Update Comment
                </Button>
                <Button
                  type="button"
                  size={"sm"}
                  color="dark"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-300 mb-1">
              {comment?.content}
            </p>
            <div className="flex items-center pt-2 gap-2 text-sm border-t-1 border-gray-600 dark:border-gray-300">
              <button
                className={`
            text-gray-600 dark:text-gray-400 hover:text-blue-500 
            ${
              currentUser &&
              comment?.likes?.includes(currentUser._id) &&
              "!text-blue-500"
            } `}
                type="button"
                onClick={() => handleLike(comment?._id)}
              >
                {}
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-600 dark:text-gray-400">
                {comment?.numberOfLikes === 0
                  ? "0 likes"
                  : comment.likes.length === 1
                  ? `${comment.numberOfLikes} like`
                  : `${comment.numberOfLikes} likes`}
              </p>
              {currentUser &&
                (currentUser._id == comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-600 dark:text-gray-400 hover:!text-cyan-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-600 dark:text-gray-400 hover:!text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
