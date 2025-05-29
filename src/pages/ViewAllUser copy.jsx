"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewAllUser() {
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [open, setOpen] = useState(false);

  const handleGetAllTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tiktok/get-tags-list`);
      console.log(response.data);
      setTags(response.data.map((item) => item.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
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
    setSelectedTags((current) => current.filter((t) => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  useEffect(() => {
    handleGetAllTags();
  }, []);

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Search and Select Tags</label>

          <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-auto min-h-10"
                  type="button"
                >
                  <span className="truncate">
                    {selectedTags.length > 0
                      ? `${selectedTags.length} tag${
                          selectedTags.length > 1 ? "s" : ""
                        } selected`
                      : "Select tags..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search tags..." />
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {tags.map((tag) => (
                        <CommandItem
                          key={tag}
                          onSelect={() => toggleTag(tag)}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                            id={`tag-${tag}`}
                            className="mr-2"
                          />
                          <span>{tag}</span>
                          {selectedTags.includes(tag) && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
                {selectedTags.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllTags}
                    className="h-6 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAllUser;
