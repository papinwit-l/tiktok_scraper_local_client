"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  AlertTriangle,
  Activity,
  Pause,
  Play,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SyncAndExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [users, setUsers] = useState([]);
  const [estimateTime, setEstimateTime] = useState("0 seconds");
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [syncState, setSyncState] = useState({
    success: 0,
    errors: 0,
    lastSync: null,
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sync & Export</h1>
            <p className="text-muted-foreground">
              Manage your TikTok user data synchronization and exports
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sync" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="sync" className="gap-2 text-base">
              <RefreshCw className="h-4 w-4" />
              Sync Data
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2 text-base">
              <Download className="h-4 w-4" />
              Export Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync">
            <SyncData
              isSyncing={isSyncing}
              setIsSyncing={setIsSyncing}
              progress={progress}
              setProgress={setProgress}
              totalUser={totalUser}
              setTotalUser={setTotalUser}
              users={users}
              setUsers={setUsers}
              estimateTime={estimateTime}
              setEstimateTime={setEstimateTime}
              finished={finished}
              setFinished={setFinished}
              summary={summary}
              setSummary={setSummary}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              syncState={syncState}
              setSyncState={setSyncState}
            />
          </TabsContent>
          <TabsContent value="export">
            <ExportData />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SyncAndExport;

function SyncData({
  isSyncing,
  setIsSyncing,
  progress,
  setProgress,
  totalUser,
  setTotalUser,
  users,
  setUsers,
  estimateTime,
  setEstimateTime,
  finished,
  setFinished,
  summary,
  setSummary,
  currentUser,
  setCurrentUser,
  syncState,
  setSyncState,
}) {
  const APP_API = import.meta.env.VITE_API_URL;
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false); // Add ref to track pause state
  const [syncStartTime, setSyncStartTime] = useState(null);
  const [realTimeETA, setRealTimeETA] = useState("");
  const [avgTimePerUser, setAvgTimePerUser] = useState(10); // Default 10 seconds
  const [processedCount, setProcessedCount] = useState(0);

  const calculateEstimateTime = (user, timePerUser = 10) => {
    const seconds = user * timePerUser;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return `${seconds} seconds`;
    }
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return "Almost done";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const updateRealTimeETA = () => {
    if (!isSyncing || !syncStartTime || processedCount === 0) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - syncStartTime) / 1000; // in seconds
    const currentAvgTime = elapsedTime / processedCount;

    setAvgTimePerUser(currentAvgTime);

    const remainingUsers = totalUser - processedCount;
    const estimatedSecondsRemaining = remainingUsers * currentAvgTime;

    setRealTimeETA(formatTimeRemaining(estimatedSecondsRemaining));
  };

  // Update ETA every second during sync
  useEffect(() => {
    let interval;
    if (isSyncing && !isPaused && syncStartTime) {
      interval = setInterval(updateRealTimeETA, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSyncing, isPaused, syncStartTime, processedCount, totalUser]);

  // Sync isPaused state with ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${APP_API}/tiktok/list-all-users`);
      setTotalUser(response.data.length);
      setUsers(response.data);
      setEstimateTime(calculateEstimateTime(response.data.length));
    } catch (error) {
      console.error("Error fetching users:", error);
      setTotalUser(0);
      setEstimateTime("0 seconds");
    }
  };

  const getUserInfo = async (userBatch, shouldCheckPause = false) => {
    try {
      const promises = userBatch.map(async (username) => {
        // Check for pause before processing each user using ref
        if (shouldCheckPause && isPausedRef.current) {
          window.location.reload();
          // throw new Error("PAUSED");
          //refresh the page
        }

        setCurrentUser(username);
        const response = await axios.post(`/tiktok/get-user-info`, {
          username: username,
        });

        // Check for pause again after the first API call using ref
        if (shouldCheckPause && isPausedRef.current) {
          window.location.reload();
          // throw new Error("PAUSED");
        }

        const response2 = await axios.post(
          `${APP_API}/tiktok/update-user-data`,
          {
            userData: response.data,
          }
        );

        setUsers((state) => {
          return state.map((user) => {
            if (user.username === username) {
              return response2.data;
            }
            return user;
          });
        });
        return true;
      });

      const results = await Promise.allSettled(promises);

      // Check if any promise was rejected due to pause
      const pausedResults = results.filter(
        (result) =>
          result.status === "rejected" && result.reason?.message === "PAUSED"
      );

      if (pausedResults.length > 0) {
        // If paused during processing, throw to stop the batch
        throw new Error("BATCH_PAUSED");
      }

      const batchResult = results.reduce(
        (acc, result) => {
          if (result.status === "fulfilled" && result.value) acc.success++;
          else acc.error++;
          return acc;
        },
        { success: 0, error: 0 }
      );

      // Update processed count for real-time ETA calculation
      setProcessedCount((prev) => prev + userBatch.length);

      return batchResult;
    } catch (error) {
      if (error.message === "BATCH_PAUSED") {
        // Re-throw pause error to be handled by the main loop
        throw error;
      }
      console.error(`Error in batch processing:`, error);
      setProcessedCount((prev) => prev + userBatch.length);
      return { success: 0, error: userBatch.length };
    }
  };

  const getAllUsersInfo = async () => {
    setIsSyncing(true);

    const batchSize = 5;
    const usernames = users.map((user) => user.username);
    const batches = [];

    for (let i = 0; i < usernames.length; i += batchSize) {
      batches.push(usernames.slice(i, i + batchSize));
    }

    // Get last processed index and counts from localStorage
    const lastProcessedIndex =
      parseInt(localStorage.getItem("lastProcessedIndex")) || 0;
    const lastSuccessCount =
      parseInt(localStorage.getItem("successCount")) || 0;
    const lastErrorCount = parseInt(localStorage.getItem("errorCount")) || 0;
    const storedProcessedCount =
      parseInt(localStorage.getItem("processedCount")) || 0;
    const storedSyncStartTime = localStorage.getItem("syncStartTime");

    let successCount = lastSuccessCount;
    let errorCount = lastErrorCount;

    // Set initial processed count for resuming
    setProcessedCount(storedProcessedCount);

    // Set initial progress based on lastProcessedIndex
    setProgress(Math.round((lastProcessedIndex / batches.length) * 100));

    // Set sync start time (use stored time when resuming, or current time for new sync)
    let startTime;
    if (storedSyncStartTime && lastProcessedIndex > 0) {
      // Resuming - use stored start time
      startTime = parseInt(storedSyncStartTime);
    } else {
      // New sync - use current time
      startTime = Date.now();
      localStorage.setItem("syncStartTime", startTime.toString());
    }
    setSyncStartTime(startTime);

    for (let i = lastProcessedIndex; i < batches.length; i++) {
      if (isPausedRef.current) {
        // Calculate the actual processed count based on current batch index
        const currentProcessedCount = i * batchSize;

        localStorage.setItem("lastProcessedIndex", i.toString());
        localStorage.setItem("successCount", successCount.toString());
        localStorage.setItem("errorCount", errorCount.toString());
        localStorage.setItem(
          "processedCount",
          currentProcessedCount.toString()
        );
        localStorage.setItem("syncStartTime", startTime.toString());
        return;
      }

      try {
        const result = await getUserInfo(batches[i], true); // Pass true to enable pause checking
        successCount += result.success;
        errorCount += result.error;
        setProgress(Math.round(((i + 1) / batches.length) * 100));

        // Calculate the actual processed count based on completed batches
        const currentProcessedCount = (i + 1) * batchSize;

        localStorage.setItem("lastProcessedIndex", (i + 1).toString());
        localStorage.setItem("successCount", successCount.toString());
        localStorage.setItem("errorCount", errorCount.toString());
        localStorage.setItem(
          "processedCount",
          currentProcessedCount.toString()
        );
        localStorage.setItem("syncStartTime", startTime.toString());
      } catch (error) {
        if (error.message === "BATCH_PAUSED") {
          // Batch was paused mid-processing, save current state
          const currentProcessedCount = i * batchSize;

          localStorage.setItem("lastProcessedIndex", i.toString());
          localStorage.setItem("successCount", successCount.toString());
          localStorage.setItem("errorCount", errorCount.toString());
          localStorage.setItem(
            "processedCount",
            currentProcessedCount.toString()
          );
          localStorage.setItem("syncStartTime", startTime.toString());
          return;
        }
        // Handle other errors normally
        throw error;
      }
    }

    // Clean up localStorage when sync is complete
    localStorage.removeItem("lastProcessedIndex");
    localStorage.removeItem("successCount");
    localStorage.removeItem("errorCount");
    localStorage.removeItem("processedCount");
    localStorage.removeItem("syncStartTime");

    setSyncState({
      success: successCount,
      errors: errorCount,
      lastSync: new Date().toISOString(),
    });

    setSummary(
      `Processing complete. Success: ${successCount}, Errors: ${errorCount}`
    );
    setIsSyncing(false);
    setFinished(true);
    setRealTimeETA("");
    setSyncStartTime(null);
    setProcessedCount(0);
  };

  const handleSync = async () => {
    try {
      const lastProcessedIndex = parseInt(
        localStorage.getItem("lastProcessedIndex")
      );

      if (lastProcessedIndex) {
        // If there's a stored index, ask user if they want to resume
        if (
          window.confirm(
            "Previous sync was interrupted. Would you like to resume from where it left off?"
          )
        ) {
          setIsPaused(false);
          await getAllUsersInfo();
          return;
        } else {
          // Clear localStorage if user doesn't want to resume
          localStorage.removeItem("lastProcessedIndex");
          localStorage.removeItem("successCount");
          localStorage.removeItem("errorCount");
          localStorage.removeItem("processedCount");
          localStorage.removeItem("syncStartTime");
        }
      }

      // Start new sync
      setIsPaused(false);
      setFinished(false);
      setSummary("");
      setProgress(0);
      setProcessedCount(0);
      setRealTimeETA("");
      setSyncStartTime(null);
      await getAllUsers();
      await getAllUsersInfo();
    } catch (error) {
      console.error("Error during sync:", error);
      setSummary("Sync failed due to an error");
    } finally {
      setIsSyncing(false);
      setRealTimeETA("");
      setSyncStartTime(null);
      setProcessedCount(0);
    }
  };

  const handlePauseResume = () => {
    const newPauseState = !isPaused;
    setIsPaused(newPauseState);
    isPausedRef.current = newPauseState; // Update ref immediately

    if (!newPauseState) {
      // If resuming, restart the sync process
      getAllUsersInfo();
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">
                  {totalUser.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isSyncing ? "Time Remaining" : "Estimated Time"}
                </p>
                <p className="text-2xl font-bold">
                  {isSyncing && realTimeETA ? realTimeETA : estimateTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isSyncing && (
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Time/User
                  </p>
                  <p className="text-2xl font-bold">
                    {avgTimePerUser.toFixed(1)}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Sync Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Data Synchronization
          </CardTitle>
          <CardDescription>
            Update all KOL data from TikTok to keep your database current
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Syncing will take considerable time
              and the website will be unavailable during this process. Each user
              takes approximately 3-5 seconds depending on your internet speed.
            </AlertDescription>
          </Alert>

          {/* Progress Section */}
          {isSyncing && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Sync Progress</h4>
                <Badge variant="default" className="gap-1">
                  <Activity className="h-3 w-3" />
                  {isPaused ? "Paused" : "In Progress"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">Current User:</span>
                  <span className="font-medium truncate">{currentUser}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Processed:</span>
                  <span className="font-medium">
                    {processedCount} / {totalUser}
                  </span>
                </div>
                {realTimeETA && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="font-medium text-orange-600">
                      {realTimeETA}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Section */}
          {finished && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Sync Completed</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    <strong>{syncState.success}</strong> successful
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">
                    <strong>{syncState.errors}</strong> errors
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last sync:{" "}
                  {syncState.lastSync &&
                    new Date(syncState.lastSync).toLocaleString()}
                </div>
              </div>

              <Separator />
              <p className="text-sm text-green-700">{summary}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              size="lg"
              className="flex-1 gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isSyncing && !isPaused ? "animate-spin" : ""
                }`}
              />
              {isSyncing ? "Syncing in Progress..." : "Start Sync"}
            </Button>
            {isSyncing && (
              <Button
                onClick={handlePauseResume}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const GOOGLE_SHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

  const handleOpenGoogleSheet = () => {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit#gid=0`;
    window.open(url, "_blank");
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportComplete(false);
      const response = await axios.get(`${API_URL}/tiktok/get-data-for-export`);
      setExportComplete(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export your KOL data to Google Sheets for analysis and reporting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sheets Integration */}
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ExternalLink className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">
                  Google Sheets Integration
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your data will be exported to the connected Google Sheets
                  document for easy access and collaboration.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenGoogleSheet}
                  className="mt-3 gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Google Sheets
                </Button>
              </div>
            </div>
          </div>

          {/* Export Status */}
          {exportComplete && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Export completed successfully!</strong> Your data has
                been exported to Google Sheets.
              </AlertDescription>
            </Alert>
          )}

          {/* Export Actions */}
          <div className="space-y-4">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              size="lg"
              className="w-full gap-2"
            >
              <Download
                className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`}
              />
              {isExporting ? "Exporting Data..." : "Export to Google Sheets"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Export includes user profiles, follower counts, engagement
                metrics, and tag associations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">User Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Complete user information and statistics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Real-time Data</h4>
                <p className="text-sm text-muted-foreground">
                  Latest synchronized information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
