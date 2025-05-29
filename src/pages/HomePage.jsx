import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Search, Tag, Users } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 md:py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Tiktok User Finder
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            Efficiently manage and organize your tags to find the right users
            quickly
          </p>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Find Users by Tags</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Search users based on their assigned tags
              </p>
              <Button className="w-full" onClick={() => navigate("/get-tags")}>
                Get Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Tag className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Existing Tags</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                View all users from existing tags
              </p>
              <Button className="w-full" onClick={() => navigate("/view-tags")}>
                View Tags
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></div>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">View All Users</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                View all users by selecting a tag
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/view-all-users")}
              >
                View all users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></div>
            </div>

            {/* Card 4 */}
            <div className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Sync and Export</h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Sync to update all user data and Export to Google Sheets
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/sync-and-export")}
              >
                Sync and Export
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>

          {/* Features Section */}
          {/* <div className="mt-16">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Key Features
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-semibold">Easy Organization</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Organize users with a flexible tagging system
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-semibold">Quick Search</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Find exactly what you need with powerful tag filtering
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-semibold">Intuitive Interface</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modern design that makes tag management a breeze
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col gap-4 p-8">
  //     <h1 className="text-2xl">Home Page</h1>
  //     <div className="flex flex-col gap-2">
  //       <Button
  //         onClick={() => {
  //           navigate("/get-tags");
  //         }}
  //       >
  //         Get user from tags
  //       </Button>
  //       <Button
  //         onClick={() => {
  //           navigate("/view-tags");
  //         }}
  //       >
  //         View Tags
  //       </Button>
  //     </div>
  //   </div>
  // );
}

export default HomePage;
