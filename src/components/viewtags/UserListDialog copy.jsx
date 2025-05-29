import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import axios from "axios";
import { Button } from "../ui/button";
import { RefreshCcwIcon } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

function UserListDialog(props) {
  const { tags, setTags, dialogOpen, setDialogOpen } = props;

  const [users, setUsers] = useState([]);

  const handleClose = () => {
    setDialogOpen(false);
    setTags("");
    setUsers([]);
  };

  const getUserList = async () => {
    const response = await axios.post(`${BASE_URL}/tiktok/list-users-by-tag`, {
      tags: tags,
    });
    console.log(response);
    setUsers(response.data);
  };

  // const getAllUsersInfo = async (tag) => {
  //   console.log(tag);
  //   const response = await axios.post(
  //     "http://localhost:8000/tiktok/all-user-info-by-tags",
  //     {
  //       tags: tag,
  //     }
  //   );
  //   console.log(response.data);
  // };

  const getUserInfo = async (username) => {
    const response = await axios.post(`${BASE_URL}/tiktok/get-user-info`, {
      username: username,
    });
    console.log(response.data);
    //update user info
    setUsers((state) => {
      return state.map((user) => {
        if (user.username === username) {
          return response.data;
        }
        return user;
      });
    });
  };

  const getAllUsersInfo = async (tag) => {
    users.forEach((user) => {
      getUserInfo(user.username);
    });
  };

  useEffect(() => {
    getUserList();
  }, [tags]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>{tags}</DialogTitle>
          <DialogDescription>
            Users with tag: {tags}
            <br />
            total: {users.length}
          </DialogDescription>
          <div className="flex items-center">
            <Button onClick={() => getAllUsersInfo(tags)}>
              <RefreshCcwIcon />
            </Button>
          </div>
        </DialogHeader>
        {/* The key fix is setting a specific height for this container and making it scrollable */}
        <div
          className="overflow-y-auto pr-1"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.id} className="py-2">
                <div className="flex items-center pr-4">
                  <p className="text-muted-foreground p-4">{index + 1}</p>
                  <div className="flex-1 items-center grid grid-cols-[1fr_2fr]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <p className="font-medium">{user.username}</p>
                          {/* <p className="text-sm text-muted-foreground">
                        {user.signature}
                      </p> */}
                        </div>
                      </div>
                      {/* <p
                        className="text-sm text-muted-foreground hover:underline cursor-pointer"
                        onClick={() => window.open(user.tiktok_src, "_blank")}
                      >
                        {user.tiktok_src}
                      </p> */}
                    </div>

                    <div className="flex-1 flex justify-between grow">
                      <p
                        className="text-sm text-muted-foreground hover:underline cursor-pointer"
                        onClick={() => window.open(user.tiktok_src, "_blank")}
                      >
                        {user.tiktok_src}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          {user.followers} followers
                        </p>
                        {/* <p className="text-sm text-muted-foreground">
                          {user.following} following
                        </p> */}
                        <p className="text-sm text-muted-foreground">
                          {user.likes} likes
                        </p>
                        <Button
                          onClick={() => {
                            getUserInfo(user.username);
                          }}
                        >
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-2" />
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No users found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserListDialog;
