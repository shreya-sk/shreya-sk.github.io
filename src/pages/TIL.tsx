import { useState } from "react";
import { Search } from "lucide-react";
import TILCard from "@/components/TILCard";
import { useTILEntries } from "@/hooks/useTILEntries";

const TIL = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tilEntries = [], isLoading, error } = useTILEntries();

  // Filter TIL entries based on search term
  const filteredEntries = tilEntries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="container px-4 py-8 sage-gradient min-h-screen">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">loading journal entries...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 sage-gradient min-h-screen">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <p className="text-destructive mb-2 text-sm">Failed to load TIL entries</p>
            <p className="text-muted-foreground text-xs">Please check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 sage-gradient min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            daily journal
          </h1>
          <p className="text-foreground/60 text-sm mb-6">
            {tilEntries.length} today i learned moments
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary/40 h-4 w-4" />
            <input
              type="text"
              placeholder="search journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 minimal-card border border-secondary/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <TILCard key={entry.id} item={entry} />
            ))
          ) : (
            <div className="text-center py-16 journal-card rounded-3xl">
              <p className="text-foreground/60 text-sm">
                {searchTerm ? 'no entries found matching your search' : 'no journal entries yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TIL;
