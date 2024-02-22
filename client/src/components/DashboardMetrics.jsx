import axios from "axios";
import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineChatAlt2,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardMetrics() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axios.get("/api/user/getusers?limit=5").then((res) => {
          if (res.status == 200 && res.data) {
            setUsers(res.data?.users);
            setTotalUsers(res.data?.userCount);
            setLastMonthUsers(res.data?.lastMonthUsers);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        await axios.get("/api/post/getposts").then((res) => {
          if (res.status == 200 && res.data) {
            setPosts(res.data?.posts);
            setTotalPosts(res.data?.totalPosts);
            setLastMonthPosts(res.data?.lastMonthsPosts);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        await axios.get("/api/comment/getComments").then((res) => {
          if (res.status == 200 && res.data) {
            setComments(res.data?.comments);
            setTotalComments(res.data?.totalComments);
            setLastMonthComments(res.data?.lastMonthComments);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser.isAdmin]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 gap-3 w-full md:w-64 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-600 dark:text-gray-300 text-md uppercase">
                Total Users
              </h3>
              <p className="text-2xl text-gray-600 dark:text-gray-300">
                {totalUsers}
              </p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text text-gray-100 rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-600 dark:text-gray-300">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300  gap-3 w-full md:w-64 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" text-gray-600 dark:text-gray-300 text-md uppercase">
                Total Posts
              </h3>
              <p className="text-2xl text-gray-600 dark:text-gray-300">
                {totalPosts}
              </p>
            </div>
            <HiDocumentText className="bg-pink-600 text text-gray-100 rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className=" text-gray-600 dark:text-gray-300">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300  gap-3 w-full md:w-64 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className=" text-gray-600 dark:text-gray-300 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl  text-gray-600 dark:text-gray-300">
                {totalComments}
              </p>
            </div>
            <HiOutlineChatAlt2 className="bg-purple-600 text text-gray-100 rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className=" text-gray-600 dark:text-gray-300">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 py-2 justify-center mx-auto items-center">
        <div className="flex flex-col w-full md-w-auto shadow-md p-2 rounded-md dark:bg-gray-600 mt-3">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2 text-md">Recent Users</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=users"}>See All</Link>
            </Button>
          </div>
        </div>

        <div>
          <h5 className="w-full text-center text-lg font-semibold my-1">
            Users
          </h5>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>UserImage</Table.HeadCell>
              <Table.HeadCell>UserName</Table.HeadCell>
              <Table.HeadCell>User Email</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {users.length > 0 &&
                users.map((user) => (
                  <Table.Row
                    key={user._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-700 gap-1"
                  >
                    <Table.Cell className="">
                      <img
                        src={user.profilePicture}
                        alt={"user"}
                        className="w-8 h-8 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell className="flex-1 text-sm">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell className="flex-1  text-sm">
                      {user.email}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <div>
          <h5 className="w-full text-center text-lg font-semibold my-1">
            Posts
          </h5>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="">
              {posts.length > 0 &&
                posts.map((post) => (
                  <Table.Row
                    key={post._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-700"
                  >
                    <Table.Cell className="">
                      <img
                        src={post.image}
                        alt={"post"}
                        className="w-8 h-8 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell className="flex-1 text-sm">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="flex-1 text-sm">
                      {post.category}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
        <h3 className="w-full text-center text-lg font-semibold my-1">
          Comments
        </h3>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Comment Content</Table.HeadCell>
            <Table.HeadCell>Post Id</Table.HeadCell>
            <Table.HeadCell>User Id</Table.HeadCell>
          </Table.Head>
          <Table.Body className="">
            {comments.length > 0 &&
              comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-700"
                >
                  <Table.Cell className="">{comment.content}</Table.Cell>
                  <Table.Cell className="flex-1">{comment.postId}</Table.Cell>
                  <Table.Cell className="flex-1">{comment.userId}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
