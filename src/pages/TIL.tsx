
import { useState } from "react";
import { Search } from "lucide-react";
import TILCard from "@/components/TILCard";

// Mock data - this will be replaced with actual markdown file parsing
const mockTILItems = [
  {
    id: "1",
    content: "discovered CSS subgrid is finally supported everywhere. makes nested grids so much easier — no more hacky workarounds for alignment.",
    date: "2024-01-16",
  },
  {
    id: "2",
    content: "learned the hard way: server components can't use useState. need to add 'use client' directive when you need interactivity.",
    date: "2024-01-15",
  },
  {
    id: "3",
    content: "git worktree is a game changer. can work on multiple branches simultaneously without constant switching. why didn't I know this sooner?",
    date: "2024-01-14",
  },
  {
    id: "4",
    content: "the 'satisfies' operator in TypeScript is brilliant. gives you type checking without losing the specific type. safer than type assertions.",
    date: "2024-01-13",
  },
  {
    id: "5",
    content: "finally understood closures properly. they're not magic — just functions remembering their environment. mind = blown.",
    date: "2024-01-12",
  },
];

const TIL = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = mockTILItems.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-5 sage-gradient min-h-screen">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold mb-1.5 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">daily journal</h1>
          <p className="text-xs text-foreground/60 mb-3">
            quick thoughts, small wins, random discoveries.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-secondary/30 bg-background/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredItems.map((item) => (
            <TILCard key={item.id} item={item} />
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 minimal-card rounded-2xl">
              <p className="text-sm text-muted-foreground">no entries found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TIL;
