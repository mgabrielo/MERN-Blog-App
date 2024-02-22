import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashboardComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [CommentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        await axios.get(`/api/comment/getComments`).then((res) => {
          if (res.data && res.status == 200) {
            setComments(res.data?.comments);
            if (res.data?.comments?.length < 9) {
              setShowMore(false);
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async (e) => {
    e.preventDefault();
    const startIdx = comments.length;
    try {
      await axios
        .get(`/api/comment/getComments`, {
          params: { startIndex: startIdx },
        })
        .then((res) => {
          if (res.data && res.status == 200) {
            setComments((prev) => [...prev, ...res.data?.comments]);
            if (res.data?.comments?.length < 9) {
              setShowMore(false);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async () => {
    try {
      setShowModal(false);
      await axios
        .delete(`api/comment/deleteComment/${CommentIdToDelete}`)
        .then((res) => {
          if (res.status == 200) {
            setComments(
              comments.filter((comment) => comment._id !== CommentIdToDelete)
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll mx-4 md:mx-auto p-3 my-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-center">
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>
                <span>Action</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y divide-gray-400">
              {comments.map((comment, index) => (
                <Table.Row key={index} className="text-center">
                  <Table.Cell>
                    {new Date(comment?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment?.content}</Table.Cell>
                  <Table.Cell>{comment?.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true), setCommentIdToDelete(comment?._id);
                      }}
                      className="text-red-300 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="flex mx-auto text-teal-500 self-center rounded-md text-sm py-4 hover:underline"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>No Comments yet</p>
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
              Are You Sure You want to Delete This Comment ?
            </h3>
            <div className="flex gap-3 my-3 justify-center">
              <Button color="failure" onClick={handleDeleteComment}>
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
