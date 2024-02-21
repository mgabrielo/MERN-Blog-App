import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [PostIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await axios
          .get(`/api/post/getposts`, { params: { userId: currentUser._id } })
          .then((res) => {
            if (res.data && res.status == 200) {
              setUserPosts(res.data?.posts);

              if (res.data?.posts?.length < 9) {
                setShowMore(false);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id]);

  const handleShowMore = async (e) => {
    e.preventDefault();
    const startIdx = userPosts.length;
    try {
      await axios
        .get(`/api/post/getposts`, {
          params: { userId: currentUser._id, startIndex: startIdx },
        })
        .then((res) => {
          if (res.data && res.status == 200) {
            setUserPosts((prev) => [...prev, ...res.data?.posts]);
            if (res.data?.posts?.length < 9) {
              setShowMore(false);
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    try {
      setShowModal(false);
      await axios
        .delete(`api/post/deletepost/${PostIdToDelete}/${currentUser._id}`)
        .then((res) => {
          if (res.status == 200) {
            setUserPosts(
              userPosts.filter((post) => post._id !== PostIdToDelete)
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll mx-4 md:mx-auto p-3 my-3 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
              <Table.HeadCell>
                <span>Delete</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y divide-gray-400">
              {userPosts.map((post, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {new Date(post?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post?.slug}`}>
                      <img
                        src={post?.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post?.slug}`}>{post?.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post?.category}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-green-500 font-medium hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true), setPostIdToDelete(post?._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
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
        <p>no post yet</p>
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
              Are You Sure You want to Delete Post ?
            </h3>
            <div className="flex gap-3 my-3 justify-center">
              <Button color="failure" onClick={handleDeletePost}>
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
