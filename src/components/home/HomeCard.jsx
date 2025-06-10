import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function HomeCard({ cardIcon, title, description, buttonText, navigateLink }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(navigateLink);
  };
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
          {cardIcon}
        </div>
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <Button className="w-full" onClick={handleNavigate}>
        {buttonText}
        {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
      </Button>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}

export default HomeCard;
