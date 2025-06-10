import HomeCard from "@/components/home/HomeCard";
import { ArrowRight, RefreshCw, Search, Tag, Users } from "lucide-react";
import React from "react";

function HomePage() {
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
            <HomeCard
              cardIcon={<Users className="h-6 w-6" />}
              title="Find Users by Tags"
              description="Search users based on their assigned tags"
              buttonText="Get Users"
              navigateLink="/get-tags"
            />
            {/* Card 2 */}
            <HomeCard
              cardIcon={<Tag className="h-6 w-6" />}
              title="Existing Tags"
              description="View all users from existing tags"
              buttonText="View Tags"
              navigateLink="/view-tags"
            />

            {/* Card 3 */}
            <HomeCard
              cardIcon={<Search className="h-6 w-6" />}
              title="View All Users"
              description="View all users by selecting a tag"
              buttonText="View All Users"
              navigateLink="/view-all-users"
            />

            {/* Card 4 */}
            <HomeCard
              cardIcon={<RefreshCw className="h-6 w-6" />}
              title="Sync and Export"
              description="Sync to update all user data and Export to Google Sheets"
              buttonText="Sync and Export"
              navigateLink="/sync-and-export"
            />
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
