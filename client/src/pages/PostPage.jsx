import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userPost, setUserPost] = useState({});
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        setLoading(true);
        await axios
          .get(`/api/post/getposts`)
          .then((res) => {
            if (res.status == 200 && res.data?.posts?.length > 0) {
              setError(false);
              const selectedpost = res.data?.posts.find(
                (post) => post?.slug === postSlug
              );
              setUserPost(selectedpost);
            }
          })
          .catch(() => {
            setError(true);
            return;
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchUserPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        await axios.get("/api/post/getposts?limit=3").then((res) => {
          if (res.status == 200) {
            setRecentPosts(res.data?.posts);
          }
        });
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );
  }
  return (
    <main className="min-h-screen max-w-6xl mx-auto flex flex-col p-3 lg:p-0">
      {userPost && (
        <>
          <h1 className="text-3xl lg:text-4xl my-3 p-3 text-center font-serif max-w-2xl mx-auto">
            {userPost?.title}
          </h1>
          <Link
            to={`/search?category=${userPost.category}`}
            className="mt-5 self-center"
          >
            {userPost?.category !== "uncategorized" && (
              <Button pill size={"xs"} outline className="text-inherit">
                {userPost.category}
              </Button>
            )}
          </Link>
          <div className="w-full flex object-cover justify-center">
            <img
              src={userPost?.image}
              alt={userPost.title}
              className="my-8 max-h-[500px] px-20"
            />
          </div>
          <div className="flex justify-between p-3 border-b border-slate-400 my-3 gap-3 w-full max-w-4xl mx-auto">
            <span>{new Date(userPost?.createdAt).toLocaleDateString()}</span>
            <span>
              {(userPost?.content?.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: userPost && userPost?.content }}
          ></div>
          <div className="max-w-4xl mx-auto w-full my-3">
            <CallToAction />
          </div>
          <CommentSection postId={userPost._id} />
          <div className="flex flex-col justify-center items-center my-3">
            <h1 className="text-xl mt-3 font-semibold ">Recent Articles</h1>
            <div className="mt-3 flex flex-wrap gap-4 justify-center">
              {recentPosts &&
                recentPosts.length > 0 &&
                recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
