"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowDownUp,
  ArrowLeft,
  Check,
  ChevronsUpDown,
  ExternalLink,
  Grid,
  List,
  Loader2,
  Maximize2,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import SearchCheckbox from "@/components/SearchCheckbox";

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewAllUser() {
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [searchTagInput, setSearchTagInput] = useState("");
  const navigate = useNavigate();

  // New states for enhanced features
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "card"
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleGetAllTags = async () => {
    setTagsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/tiktok/get-tags-list`);
      setTags(response.data.map((item) => item.name));
      setFilteredTags(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setTagsLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((t) => t !== tag);
      } else {
        return [...current, tag];
      }
    });
  };

  const removeTag = (tag) => {
    // console.log("Removing tag:", tag);
    setSelectedTags((current) => current.filter((t) => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/tiktok/list-users-selected-tags`,
        {
          tags: selectedTags,
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error(`Error fetching info for user ${username}:`, error);
    }
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

  // Sort users based on current sort field and direction
  const sortUsers = (usersToSort) => {
    return [...usersToSort].sort((a, b) => {
      let valueA, valueB;

      // Handle different sort fields
      if (sortField === "username") {
        valueA = a.username?.toLowerCase() || "";
        valueB = b.username?.toLowerCase() || "";
      } else if (sortField === "followers") {
        // valueA = Number.parseInt(a.followers || 0);
        valueA = convertToNumber(a.followers) || 0;
        // valueB = Number.parseInt(b.followers || 0);
        valueB = convertToNumber(b.followers) || 0;
      } else if (sortField === "likes") {
        // valueA = Number.parseInt(a.likes || 0);
        valueA = convertToNumber(a.likes) || 0;
        // valueB = Number.parseInt(b.likes || 0);
        valueB = convertToNumber(b.likes) || 0;
      }

      // Sort based on direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  // Filter users based on search query
  const filterUsers = (usersToFilter) => {
    if (!searchQuery.trim()) return usersToFilter;

    const query = searchQuery.toLowerCase();
    return usersToFilter.filter(
      (user) =>
        user.username?.toLowerCase().includes(query) ||
        user.tiktok_src?.toLowerCase().includes(query)
    );
  };

  // Get processed users (sorted and filtered)
  const getProcessedUsers = () => {
    return filterUsers(sortUsers(users));
  };

  // Toggle sort direction or change sort field
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    handleGetAllTags();
  }, []);

  // Format tags for display
  const getTagsDisplay = () => {
    if (selectedTags.length === 0) return "All Users";
    if (selectedTags.length === 1) return `Users for "${selectedTags[0]}"`;
    if (selectedTags.length === 2)
      return `Users for "${selectedTags[0]}" and "${selectedTags[1]}"`;
    if (selectedTags.length > 2) return `Users for ${selectedTags.length} tags`;
  };

  // Render user in list view
  const renderUserListItem = (user, index) => (
    <div
      key={user.id || index}
      className="py-4 px-6 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground font-medium w-8 text-center">
          {index + 1}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "/placeholder.svg?height=40&width=40"}
              alt={user.username}
              className="w-12 h-12 rounded-full border object-cover"
            />
            <div className="flex flex-col">
              <p className="font-medium">{user.username}</p>
              <a
                href={user.tiktok_src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 md:hidden"
              >
                Visit Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <a
              href={user.tiktok_src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 hidden md:flex"
            >
              {user.tiktok_src}
              <ExternalLink className="h-3 w-3" />
            </a>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <p className="font-medium">{user.followers}</p>
                <p className="text-xs text-muted-foreground">followers</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-medium">{user.likes}</p>
                <p className="text-xs text-muted-foreground">likes</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => getUserInfo(user.username)}
                className="h-8 px-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render user in card view
  const renderUserCard = (user, index) => (
    <Card
      key={user.id || index}
      className="overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardContent className="flex flex-col p-0">
        <div className="p-2 px-8 bg-gray-100">#{index}</div>
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "/placeholder.svg?height=60&width=60"}
                alt={user.username}
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-lg">{user.username}</p>
                <a
                  href={user.tiktok_src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1"
                >
                  Visit Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => getUserInfo(user.username)}
                className="h-8 px-2 self-start"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-muted/30 rounded-md p-3 text-center">
                <p className="font-medium">{user.followers}</p>
                <p className="text-xs text-muted-foreground">followers</p>
              </div>
              <div className="bg-muted/30 rounded-md p-3 text-center">
                <p className="font-medium">{user.likes}</p>
                <p className="text-xs text-muted-foreground">likes</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const processedUsers = getProcessedUsers();

  return (
    <div className="container mx-auto py-6 px-4 flex flex-col h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="w-fit px-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Search Users by Tags</h1>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="px-4 py-0 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Search and Select Tags
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <SearchCheckbox
                    items={tags}
                    selectedItem={selectedTags}
                    setSelectedItem={setSelectedTags}
                    inputValue={searchTagInput}
                    setInputValue={setSearchTagInput}
                    filteredItems={filteredTags}
                    setFilteredItems={setFilteredTags}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || selectedTags.length === 0}
                    className="w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Users
                      </>
                    )}
                  </Button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {tag}
                        <div onClick={() => removeTag(tag)}>
                          <X
                            className="h-3 w-3 cursor-pointer ml-1"
                            // onClick={() => removeTag(tag)}
                          />
                        </div>
                      </Badge>
                    ))}
                    {selectedTags.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllTags}
                        className="h-7 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {users.length > 0 && (
        <Card className="mt-6 flex-1 overflow-hidden shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-muted/30">
            <CardTitle className="text-lg font-medium">Users Results</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                Total: {users.length} users
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto h-[calc(100vh-320px)]">
              {processedUsers.length > 0 ? (
                processedUsers.map((user, index) =>
                  renderUserListItem(user, index)
                )
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    No users match your search criteria
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12 flex-1">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading users...</span>
          </div>
        </div>
      )}

      {!loading && users.length === 0 && selectedTags.length > 0 && (
        <Card className="mt-6 flex-1">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-muted-foreground text-center mb-4">
              <p className="text-lg">No users found</p>
              <p>No users found matching the selected tags.</p>
            </div>
            <Button variant="outline" onClick={handleSubmit} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog for expanded user list view */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[90vw] min-w-[90vw] w-[90vw] p-0 pt-4">
          <DialogHeader className="p-6 border-b">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <DialogTitle className="text-xl whitespace-normal">
                {getTagsDisplay()}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowDownUp className="h-3.5 w-3.5" />
                        {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                        {sortDirection === "asc" ? (
                          <SortAsc className="h-3.5 w-3.5" />
                        ) : (
                          <SortDesc className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSort("username")}>
                        Username{" "}
                        {sortField === "username" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("followers")}>
                        Followers{" "}
                        {sortField === "followers" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("likes")}>
                        Likes{" "}
                        {sortField === "likes" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) => value && setViewMode(value)}
                  >
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="card" aria-label="Card view">
                      <Grid className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto h-[calc(90vh-140px)] p-6">
            {processedUsers.length > 0 ? (
              viewMode === "list" ? (
                <div className="space-y-2">
                  {processedUsers.map((user, index) =>
                    renderUserListItem(user, index)
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedUsers.map((user, index) =>
                    renderUserCard(user, index)
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  No users match your search criteria
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewAllUser;
