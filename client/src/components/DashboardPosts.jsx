import axios from "axios";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await axios
          .get(`/api/post/getposts?userId=${currentUser._id}`)
          .then((res) => {
            if (res.data && res.status == 200) {
              setUserPosts(res.data.posts);
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

  return (
    <div>
      {currentUser.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body>
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
                    <span>Delete</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span>Edit</span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>no post yet</p>
      )}
    </div>
  );
}
