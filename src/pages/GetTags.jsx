import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, User, ExternalLink, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

function GetTags() {
  const navigate = useNavigate();
  const [tags, setTags] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTagChange = (event) => {
    setTags(event.target.value);
  };

  const handleUploadData = async (users) => {
    try {
      const response = await axios.post(`${BASE_URL}/tiktok/update-tag-users`, {
        tags: tags,
        users: users,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleCreateTagHistory = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tiktok/create-tag-sync-history`,
        {
          tag: tags,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating tag history:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/tiktok/get-posts-tags`, {
        tags: tags,
      });

      setData({
        ...response.data.data,
        users: [
          ...new Set(response.data.data.userInfo.map((user) => user.username)),
        ].map((username) =>
          response.data.data.userInfo.find((user) => user.username === username)
        ),
      });

      const users = [
        ...new Set(response.data.data.userInfo.map((user) => user.username)),
      ].map((username) =>
        response.data.data.userInfo.find((user) => user.username === username)
      );
      console.log("users: ", users);
      console.log("users length: ", users.length);
      await handleUploadData(users);
      await handleCreateTagHistory();
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">Find Users by Tags</h1>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter tags (e.g. fashion, travel)"
                  value={tags}
                  onChange={handleTagChange}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !tags.trim()}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search Users"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {data.posts && (
            <div className="mb-4 rounded-lg bg-teal-100 p-4 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
              <p className="font-medium">
                Found {data.posts} posts matching your tags
              </p>
            </div>
          )}

          {data.users && data.users.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-semibold">
                Users ({data.users.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.users.map((user, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3 mt-2 h-16 w-16 overflow-hidden rounded-full border-2 border-teal-500 p-1">
                          {user.userAvatar ? (
                            <img
                              src={user.userAvatar || "/placeholder.svg"}
                              alt={user.username}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                              <User className="h-8 w-8 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <h3 className="mb-1 font-medium">{user.username}</h3>
                        <a
                          href={`https://www.tiktok.com/@${user.username}?lang=en`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          View Profile
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {isLoading && (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
          )}

          {!isLoading && !error && !data.users && (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-slate-500 dark:border-slate-700">
              <Search className="mb-2 h-8 w-8 text-slate-400" />
              <p>Enter tags to find TikTok users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetTags;
