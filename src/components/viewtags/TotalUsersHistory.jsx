"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

function TotalUsersHistory(props) {
  const { open, setOpen, tag } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetTagHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/tiktok/get-tag-sync-history`,
        { tag: tag }
      );

      setData(
        response.data
          .map((item) => {
            const dateRaw = new Date(item.created_at);
            const formattedDate = dateRaw.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return {
              date: formattedDate,
              totalUsers: item.total_user,
            };
          })
          .reverse()
      );
    } catch (error) {
      console.error("Error fetching tag history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && tag) {
      handleGetTagHistory();
    }
  }, [tag, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Total Users History for "{tag}"
          </DialogTitle>
          <DialogDescription>
            View the history of user counts for this tag over time.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Total Users
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="px-4 py-3">{item.date}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {item.totalUsers}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No history data available for this tag
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TotalUsersHistory;
