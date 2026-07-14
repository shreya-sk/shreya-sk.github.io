import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Code, Calendar } from "lucide-react";
import { useGists } from "../hooks/useGists";
import { extractFirstHeading, type Gist } from "../services/gistsService";

const Gists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: gists = [], isLoading, error } = useGists();

  const filteredGists = gists.filter((gist: Gist) =>
    gist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(gist.files).some((file: Gist['files'][string]) =>
      file.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="container px-6 py-14 sage-gradient min-h-screen">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm font-mono">loading gists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-6 py-14 sage-gradient min-h-screen">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-12">
            <p className="text-destructive mb-2 text-sm font-mono">Failed to load gists</p>
            <p className="text-muted-foreground text-xs font-mono">Check console for details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-6 py-14 sage-gradient min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="mb-2 flex items-baseline justify-between">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
            gists
          </h1>
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {gists.length} snippets
          </span>
        </div>
        <p className="font-mono text-sm text-muted-foreground mb-2">
          too short for a blog, too long for til
        </p>

        <div className="relative border-b-2 border-foreground/90 mb-10">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-accent h-3.5 w-3.5" />
          <input
            type="text"
            placeholder="search gists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-0 outline-none font-mono text-sm py-3 pl-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-foreground/20">
          {filteredGists.map((gist: Gist, i) => {
            const fileCount = Object.keys(gist.files).length;
            const firstFile = Object.values(gist.files)[0] as Gist['files'][string] | undefined;
            const createdDate = new Date(gist.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            let title = "Untitled";
            if (firstFile?.content && firstFile.filename?.endsWith('.md')) {
              const heading = extractFirstHeading(firstFile.content);
              if (heading) {
                title = heading;
              } else if (gist.description) {
                title = gist.description;
              } else if (firstFile.filename) {
                title = firstFile.filename.replace('.md', '');
              }
            } else if (gist.description) {
              title = gist.description;
            } else if (firstFile?.filename) {
              title = firstFile.filename;
            }

            return (
              <Link
                key={gist.id}
                to={`/gists/${gist.id}`}
                className={`group block p-6 border-r border-b border-foreground/20 hover:bg-accent/5 transition-colors ${
                  (i + 1) % 3 === 0 ? 'md:border-r-0' : ''
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground mb-2.5">
                  {createdDate}
                </div>

                <h3 className="text-lg font-extrabold tracking-tight mb-3 break-words group-hover:text-accent transition-colors">
                  {title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {Object.values(gist.files).map((file: Gist['files'][string]) => (
                    <span
                      key={file.filename}
                      className="text-[11px] px-2 py-0.5 border border-foreground/20 text-muted-foreground font-mono"
                    >
                      {file.filename}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-accent">
                  {firstFile?.language && <span>{firstFile.language}</span>}
                  <span className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {fileCount} {fileCount === 1 ? 'file' : 'files'}
                  </span>
                </div>
              </Link>
            );
          })}

          {filteredGists.length === 0 && (
            <div className="col-span-full text-center py-16 border-r border-b border-foreground/20">
              <p className="text-sm text-muted-foreground font-mono">no snippets found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gists;
