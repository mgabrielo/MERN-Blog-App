import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import axios from "axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await axios.get("/api/post/getposts").then((res) => {
          if (res.status == 200 && res.data) {
            setPosts(res.data?.posts);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 p-3 lg:p-16 w-full ">
        <h1 className="text-3xl lg:text-5xl font-bold">Welcome To My Blog</h1>
        <p className="text-gray-500 dark:text-gray-300 sm:text-md">
          Review a step-by-step guide plus useful templates to learn how to
          write an effective blog post for your target audience and customers.
        </p>
        <Link
          to="/search"
          className="text-sm sm:text-md text-cyan-700 dark:text-cyan-500 font-semibold hover:underline"
        >
          View All Posts
        </Link>
        <div className="flex justify-center bg-amber-200 dark:bg-slate-700 py-5 w-full mt-3 rounded-md">
          <CallToAction />
        </div>
      </div>
      <div className="max-w-6xl">
        {posts && posts.length > 0 && (
          <div className="flex flex-col items-center gap-4 justify-center px-4 md:px-8 lg:px-12 text-center">
            <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
        <div className=" w-full my-5 text-center">
          <Link
            to="/search"
            className="text-lg  text-teal-500 dark:text-cyan-500 hover:underline text-center"
          >
            View All Post
          </Link>
        </div>
      </div>
    </div>
  );
}
