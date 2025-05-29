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
} from "lucide-react";
import { useState, useEffect } from "react";
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

  const calculateEstimateTime = (user) => {
    const seconds = user * 10;
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

  const getAllUsers = async () => {
    try {
      console.log(`${APP_API}/tiktok/list-all-users`);
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

  const getUserInfo = async (username) => {
    try {
      setCurrentUser(username);
      const response = await axios.post(`/tiktok/get-user-info`, {
        username: username,
      });

      //Update user data to main server.
      const response2 = await axios.post(`${APP_API}/tiktok/update-user-data`, {
        userData: response.data,
      });

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

  const getAllUsersInfo = async () => {
    setIsSyncing(true);
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
        setProgress(Math.round(((i + 1) / totalUsers) * 100));
      }
    }

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
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setFinished(false);
      setSummary("");
      setProgress(0);
      await getAllUsers();
      await getAllUsersInfo();
    } catch (error) {
      console.error("Error during sync:", error);
      setSummary("Sync failed due to an error");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Estimated Time
                </p>
                <p className="text-2xl font-bold">{estimateTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    isSyncing ? "default" : finished ? "secondary" : "outline"
                  }
                >
                  {isSyncing ? "Syncing" : finished ? "Completed" : "Ready"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card> */}
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
              takes approximately 10-20 seconds depending on your internet
              speed.
            </AlertDescription>
          </Alert>

          {/* Progress Section */}
          {isSyncing && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Sync Progress</h4>
                <Badge variant="default" className="gap-1">
                  <Activity className="h-3 w-3" />
                  In Progress
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">Current User:</span>
                  <span className="font-medium truncate">{currentUser}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Processed:</span>
                  <span className="font-medium">
                    {Math.round((progress / 100) * totalUser)} / {totalUser}
                  </span>
                </div>
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

          {/* Action Button */}
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            size="lg"
            className="w-full gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing in Progress..." : "Start Sync"}
          </Button>
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
