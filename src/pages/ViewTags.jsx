import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Loader2 } from "lucide-react";
import UserListDialog from "@/components/viewtags/UserListDialog";

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewTags() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/tiktok/get-tags-list`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to load tags. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTagClick = (tag) => {
    setTags(tag);
    setDialogOpen(true);
  };

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
          <h1 className="text-2xl font-bold md:text-3xl">Manage Tags</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="ml-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Tags List */}
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Tags</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {data.map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  className="flex items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/30"
                  onClick={() => handleTagClick(tag.name)}
                >
                  <Tag className="h-4 w-4 flex-shrink-0" />
                  <span className="overflow-hidden text-ellipsis">
                    {tag.name}
                  </span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-slate-500 dark:border-slate-700">
              <Tag className="mb-2 h-8 w-8 text-slate-400" />
              <p>No tags found</p>
            </div>
          )}
        </div>

        {/* User List Dialog */}
        {dialogOpen && (
          <UserListDialog
            tags={tags}
            setTags={setTags}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        )}
      </div>
    </div>
  );
}

export default ViewTags;
