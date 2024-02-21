import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import { HiExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 400) {
      return;
    }
    try {
      await axios
        .post("/api/comment/create", {
          content: comment,
          userId: currentUser._id,
          postId: postId,
        })
        .then((res) => {
          if (res.status == 200 && res.data) {
            const formNode = document.getElementById("commentFormId");
            formNode.reset();
            setComment("");
            setCommentError("");
            setComments((prev) => [res.data?.comment, ...prev]);
          }
        })
        .catch((err) => {
          setCommentError(err?.message);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function getComments() {
      try {
        await axios
          .get(`/api/comment/getPostComments/${postId}`)
          .then((res) => {
            if (res.status == 200) {
              setComments(res.data?.comments);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      await axios.put(`/api/comment/likeComment/${commentId}`).then((res) => {
        if (res.status == 200) {
          setComments(
            comments.map((userComment) =>
              userComment._id == commentId
                ? {
                    ...userComment,
                    likes: res.data?.comment?.likes,
                    numberOfLikes: res.data?.comment?.numberOfLikes,
                  }
                : userComment
            )
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((userComment) =>
        userComment._id === comment._id
          ? {
              ...userComment,
              content: editedContent,
            }
          : userComment
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      await axios
        .delete(`/api/comment/deleteComment/${commentId}`)
        .then((res) => {
          if (res.status == 200 && res.data) {
            setComments(
              comments.filter((userComment) => userComment._id !== commentId)
            );
            setShowModal(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-3 my-3 text-sm">
          <p>Signed In As : </p>
          <img
            className="h-8 w-8 object-cover rounded-full "
            src={currentUser?.profilePicture}
            alt={"user-comment-tag"}
          />
          <Link
            to={"/dashboard/?tab=profile"}
            className="text-md text-cyan-400 hover:underline"
          >
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm flex flex-col my-3 text-cyan-600 dark:text-cyan-200   gap-3">
          You must be logged in to Comment
          <Link to={"/signin"} className="hover:underline">
            Sign In to get started
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border-2 border-teal-500 p-3 rounded-md"
          id="commentFormId"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add your Comment..."
            rows={3}
            onChange={(e) => setComment(e.target.value)}
            maxLength={400}
          />
          <div className="flex justify-between gap-2 items-center my-3">
            <p className="text-gray-500 dark:text-gray-200 text-sm">
              {400 - comment.length} characters remaining
            </p>

            <Button
              type="submit"
              outline
              gradientDuoTone={"purpleToBlue"}
              size={"sm"}
            >
              Post Comment
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-3">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-4">No Comments Yet</p>
      ) : (
        <>
          <div className="text-sm flex gap-2 items-center my-3">
            <p className="mb-0.5">Comments</p>
            <div className="border border-gray-300 rounded-full px-2">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((postComment) => (
            <Comments
              key={postComment._id}
              comment={postComment}
              handleLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header
          title="Delete Account"
          className=" text-gray-500 dark:text-gray-300"
        />
        <Modal.Body>
          <div className="text-center">
            <HiExclamationCircle className="h-14 w-14 mb-3 text-gray-500 dark:text-gray-300 mx-auto" />
            <h3 className=" text-gray-500 dark:text-gray-300 text-lg font-semibold">
              Are You Sure You want to Delete Comment ?
            </h3>
            <div className="flex gap-3 my-3 justify-center">
              <Button
                color="failure"
                onClick={() => handleDeleteComment(commentToDelete)}
              >
                Yes, I'm Sure
              </Button>
              <Button
                className="bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
