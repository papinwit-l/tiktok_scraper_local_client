import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  Grid,
  List,
  ArrowUp,
  ArrowDown,
  User,
  Heart,
  Users,
  ExternalLink,
  Loader2,
  Tag,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TotalUsersHistory from "./TotalUsersHistory";

const BASE_URL = import.meta.env.VITE_API_URL;

function UserListDialog(props) {
  const { tags, setTags, dialogOpen, setDialogOpen } = props;

  const [historyOpen, setHistoryOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState("card"); // "list" or "card"
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    setDialogOpen(false);
    setTags("");
    setUsers([]);
    setFilteredUsers([]);
  };

  const formatUsername = (username) => {
    // console.log(username);
    // console.log(username.length);
    if (username.length > 15) {
      // console.log(username);

      // console.log("display_username: " + username.substring(0, 15) + "...");
      return username.substring(0, 15) + "...";
    }
    return username;
  };
  const getUserList = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tiktok/list-users-by-tag`,
        {
          tags: tags,
        }
      );
      setUsers(
        response.data.map((item) => {
          const result = {
            ...item,
            display_username: formatUsername(item.username),
          };
          // console.log(result);
          return result;
        })
      );
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const getUserInfo = async (username) => {
    try {
      const response = await axios.post(`/tiktok/get-user-info`, {
        username: username,
      });

      //Update user data to main server.
      const response2 = await axios.post(
        `${BASE_URL}/tiktok/update-user-data`,
        {
          userData: response.data,
        }
      );
      // console.log(response2.data);

      // Update user info
      setUsers((state) => {
        return state.map((user) => {
          if (user.username === username) {
            return response2.data;
          }
          return user;
        });
      });
      return true;
    } catch (error) {
      console.error(`Error fetching info for user ${username}:`, error);
      return false;
    }
  };

  const updateAllUserData = async () => {
    const response = await axios.post(
      `${BASE_URL}/tiktok/update-all-user-data`,
      {
        userData: users,
      }
    );
    console.log(response.data);
  };

  const getAllUsersInfo = async () => {
    setLoading(true);
    setProgress(0);

    const totalUsers = users.length;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < totalUsers; i++) {
      try {
        const success = await getUserInfo(users[i].username);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${users[i].username}:`, error);
        errorCount++;
      } finally {
        // Update progress regardless of success or failure
        // await updateAllUserData();
        setProgress(Math.round(((i + 1) / totalUsers) * 100));
      }
    }

    console.log(
      `Processing complete. Success: ${successCount}, Errors: ${errorCount}`
    );
    setLoading(false);
  };

  const convertToNumber = (value) => {
    let result = 0;
    if (value) {
      const num = parseFloat(value.replace(/[KMB]/g, ""));
      if (value.includes("K")) {
        result = num * 1000;
      } else if (value.includes("M")) {
        result = num * 1000000;
      } else if (value.includes("B")) {
        result = num * 1000000000;
      } else {
        result = num;
      }
    }
    return result;
  };

  // Sort and filter users
  useEffect(() => {
    if (!users.length) return;

    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          (user.signature && user.signature.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortField] || 0;
      let valueB = b[sortField] || 0;

      // Handle numeric values
      if (sortField === "followers" || sortField === "likes") {
        // valueA = Number.parseInt(valueA) || 0;
        valueA = convertToNumber(valueA) || 0;
        // valueB = Number.parseInt(valueB) || 0;
        valueB = convertToNumber(valueB) || 0;
      }

      // Handle string values
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
      }
      if (typeof valueB === "string") {
        valueB = valueB.toLowerCase();
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredUsers(result);
  }, [users, sortField, sortDirection, searchQuery]);

  useEffect(() => {
    if (tags) {
      getUserList();
    }
  }, [tags]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const getSortIcon = () => {
    if (sortDirection === "asc") {
      return <SortAsc className="h-4 w-4" />;
    } else {
      return <SortDesc className="h-4 w-4" />;
    }
  };

  const handleSortType = (type) => {
    if (type === "username") {
      setSortField("username");
      setSortDirection("asc");
    } else {
      setSortField(type);
      setSortDirection("desc");
    }
  };

  const handleViewHistory = () => {
    setHistoryOpen(true);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-teal-500" />
            <span>{tags}</span>
          </DialogTitle>
          <DialogDescription>
            Users with tag: <Badge variant="outline">{tags}</Badge>
            <span className="ml-2">Total: {users.length}</span>
            <Button
              variant={`ghost`}
              className={"hover:bg-transparent hover:underline"}
              onClick={handleViewHistory}
            >
              View History
            </Button>
          </DialogDescription>

          {/* Controls */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className={
                  viewMode === "card"
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>

            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={sortField}
                onValueChange={handleSortType}
                className="w-[180px]"
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortDirection}
              >
                {getSortIcon()}
              </Button>
              <Button
                onClick={getAllUsersInfo}
                disabled={loading}
                // className="bg-teal-500 text-white hover:bg-teal-600"
              >
                <RefreshCcw
                  className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refresing..." : "Refresh All Users"}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="w-full">
              <Progress value={progress} className="h-2" />
              <p className="mt-1 text-xs text-slate-500">
                Updating user information: {progress}% complete
              </p>
            </div>
          )}
        </DialogHeader>

        {/* User list container */}
        <div
          className="overflow-y-auto pr-1"
          style={{ maxHeight: "calc(90vh - 220px)" }}
        >
          {filteredUsers.length > 0 ? (
            viewMode === "list" ? (
              /* ----- List View ---------*/
              /* ----- List View ---------*/
              /* ----- List View ---------*/
              <div className="space-y-2">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user.id || index}
                    className="rounded-lg border bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">
                        {index + 1}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-teal-200 dark:border-teal-800">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          {user.signature && (
                            <p className="text-sm text-slate-500 line-clamp-1">
                              {user.signature}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-0">
                          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>{user.followers || "N/A"}</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Heart className="h-4 w-4" />
                            <span>{user.likes || "N/A"}</span>
                          </div>

                          <a
                            href={user.tiktok_src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Profile</span>
                          </a>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => getUserInfo(user.username)}
                            disabled={loading}
                            className="ml-auto"
                          >
                            <RefreshCcw
                              className={`mr-1 h-3 w-3 ${
                                loading ? "animate-spin" : ""
                              }`}
                            />
                            Refresh
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ---------- Card View ---------- */
              /* ---------- Card View ---------- */
              /* ---------- Card View ---------- */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredUsers.map((user, index) => (
                  <Card
                    key={user.id || index}
                    className="overflow-hidden pb-0 pt-4"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        {/* <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4"> */}
                        <div className="bg-slate-100 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.username}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-8 w-8 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">
                                  #{index + 1}
                                </span>
                                <h3 className="font-medium text-wrap break-words">
                                  {user.display_username}
                                </h3>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              onClick={() => getUserInfo(user.username)}
                              disabled={loading}
                              className="h-8 w-8 rounded-full"
                            >
                              <RefreshCcw
                                className={`h-4 w-4 ${
                                  loading ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4">
                          {user.signature && (
                            <p className="mb-3 text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
                              {user.signature}
                            </p>
                          )}

                          <div className="mb-3 grid grid-cols-2 gap-2">
                            <div className="rounded-md bg-slate-100 p-2 text-center dark:bg-slate-800">
                              <div className="text-lg font-semibold">
                                {user.followers || "N/A"}
                              </div>
                              <div className="text-xs text-slate-500">
                                Followers
                              </div>
                            </div>
                            <div className="rounded-md bg-slate-100 p-2 text-center dark:bg-slate-800">
                              <div className="text-lg font-semibold">
                                {user.likes || "N/A"}
                              </div>
                              <div className="text-xs text-slate-500">
                                Likes
                              </div>
                            </div>
                          </div>

                          <a
                            href={user.tiktok_src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-1 rounded-md bg-teal-500 py-2 text-sm font-medium text-white hover:bg-teal-600"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Profile</span>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-slate-500 dark:border-slate-700">
              {loading ? (
                <>
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-teal-500" />
                  <p>Loading users...</p>
                </>
              ) : (
                <>
                  <User className="mb-2 h-8 w-8 text-slate-400" />
                  <p>No users found</p>
                </>
              )}
            </div>
          )}
        </div>
        <TotalUsersHistory
          open={historyOpen}
          setOpen={setHistoryOpen}
          tag={tags}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UserListDialog;
