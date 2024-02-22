import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 transition-all h-[430px] overflow-hidden rounded-lg  line-clamp-2">
      <Link to={`/post/${post.slug}`}>
        <div className=" w-full h-[300px] object-cover group-hover:h-[240px] transition-all duration-300 z-20">
          <img src={post?.image} className="w-full h-full" alt={post?.title} />
        </div>
      </Link>
      <div className=" flex flex-col p-3 gap-2">
        <p className="text-lg font-semibold line-clamp-3">{post.title}</p>
        <span className="italic text-sm hidden group-hover:flex w-full justify-center">
          {post.category}
        </span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10  group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-0 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center !rounded-tr-none py-2  rounded-md !rounded-tl-none mt-1"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
}
