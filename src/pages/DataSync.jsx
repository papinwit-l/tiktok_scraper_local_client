import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

function DataSync() {
  const [data, setData] = useState(null);
  const [tiktokTags, setTiktokTags] = useState([]);
  const [tiktokUsers, setTiktokUsers] = useState([]);
  const [tiktokUserTags, setTiktokUserTags] = useState([]);
  const [tiktokTagTotalUserHistory, setTiktokTagTotalUserHistory] = useState(
    []
  );

  const handleGetData = async () => {
    try {
      //   const response = await axios.get(`${BASE_URL}/tiktok/get-data-sync`);
      console.log("DataSync");
      const response = await axios.get(
        `http://localhost:8000/tiktok/get-data-sync`
      );
      console.log(response);
      //   setData(response.data);
      if (response.data.tiktokTags) {
        setTiktokTags(response.data.tiktokTags);
        setTiktokUsers(response.data.tiktokUsers);
        setTiktokUserTags(response.data.tiktokUserTags);
        setTiktokTagTotalUserHistory(response.data.tiktokTagTotalUserHistory);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePutData = async () => {
    try {
      console.log(`${BASE_URL}/tiktok/put-data-sync`);
      const response = await axios.post(`${BASE_URL}/tiktok/put-data-sync`, {
        tiktokTags: tiktokTags,
        tiktokUsers: tiktokUsers,
        tiktokUserTags: tiktokUserTags,
        tiktokTagTotalUserHistory: tiktokTagTotalUserHistory,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>DataSync</h1>
      <Button onClick={handleGetData}>Get Data</Button>
      <Button onClick={handlePutData}>Put Data</Button>
    </div>
  );
}

export default DataSync;
