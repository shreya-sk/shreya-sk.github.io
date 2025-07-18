
import { useState } from "react";
import { Search, Lightbulb } from "lucide-react";
import TILCard from "@/components/TILCard";

// Mock data - this will be replaced with actual markdown file parsing
const mockTILItems = [
  {
    id: "1",
    title: "CSS Grid subgrid is finally here",
    content: "Learned that CSS subgrid is now supported in all major browsers. It allows grid items to participate in the grid of their parent, making complex layouts much easier to achieve.",
    date: "2024-01-16",
    tags: ["CSS", "Web Development", "Grid"]
  },
  {
    id: "2",
    title: "React Server Components can't use useState",
    content: "Server Components run on the server and can't maintain client-side state. If you need state, you have to use a Client Component by adding 'use client' directive.",
    date: "2024-01-15",
    tags: ["React", "Server Components", "Next.js"]
  },
  {
    id: "3",
    title: "Git worktree for multiple branches",
    content: "Git worktree allows you to check out multiple branches simultaneously in different directories. Perfect for when you need to work on multiple features without constant switching.",
    date: "2024-01-14",
    tags: ["Git", "Productivity", "Development"]
  },
  {
    id: "4",
    title: "TypeScript satisfies operator",
    content: "The 'satisfies' operator ensures a value conforms to a type while preserving the exact type of the value. It's like type assertion but safer.",
    date: "2024-01-13",
    tags: ["TypeScript", "Type Safety"]
  }
];

const TIL = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = mockTILItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold">Today I Learned</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            Small discoveries, quick insights, and bite-sized learnings from my daily journey. 
            Each entry captures a moment of understanding or a useful technique worth remembering.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search learnings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
        
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <TILCard key={item.id} item={item} />
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No learnings found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TIL;
