import axios from "axios";
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebBarData, setSidebBarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebBarData({
        ...sidebBarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        await axios
          .get(`/api/post/getposts?${searchQuery}`)
          .then((res) => {
            if (res.status == 200 && res.data) {
              setPosts(res.data?.posts);
              setLoading(false);
              if (res.data?.posts?.length === 9) {
                setShowMore(true);
              } else {
                setShowMore(false);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebBarData({ ...sidebBarData, searchTerm: e.target.value });
    }

    if (e.target.id == "sort") {
      const order = e.target.value || "desc";
      setSidebBarData({ ...sidebBarData, sort: order });
    }
    if (e.target.id == "category") {
      const category = e.target.value || "uncategorized";
      setSidebBarData({ ...sidebBarData, category });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebBarData.searchTerm);
    urlParams.set("sort", sidebBarData.sort);
    urlParams.set("category", sidebBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b  md:border-r  md:min-h-screen border-gray-400">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              placeholder="search..."
              id="searchTerm"
              type="text"
              value={sidebBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <Select
              onChange={handleChange}
              value={sidebBarData.sort}
              id="sort"
              className="flex-1"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebBarData.category}
              id="category"
              className="flex-1"
            >
              <option value={"uncategorized"}>Select a Category</option>
              <option value={"JavaScript"}>JavaScript</option>
              <option value={"Java"}>Java</option>
              <option value={"NextJs"}>NextJs</option>
            </Select>
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-col w-full justify-center p-3 text-2xl">
        <h1 className="">Search Results:</h1>
        <div className="p-7 flex flex-wrap gap-4 my-2">
          {posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
}
