
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Code, Calendar } from "lucide-react";
import { useGists } from "code/src/hooks/useGists";
import { extractFirstHeading } from "code/src/services/gistsService";

const Gists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: gists = [], isLoading, error } = useGists();

  const filteredGists = gists.filter(gist =>
    gist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(gist.files).some(file =>
      (file as any).filename?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="container px-4 py-5 sage-gradient min-h-screen">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">loading gists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-5 sage-gradient min-h-screen">
        <div className="mx-auto max-w-4xl">
          <div className="text-center py-12">
            <p className="text-destructive mb-2 text-sm">Failed to load gists</p>
            <p className="text-muted-foreground text-xs">Check console for details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-5 sage-gradient min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold mb-1.5 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            gists
          </h1>
          <p className="text-xs text-foreground/60 mb-3">
            too short for a blog, too long for til — {gists.length} gists
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="search gists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-accent/30 bg-background/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredGists.map((gist) => {
            const fileCount = Object.keys(gist.files).length;
            const firstFile = Object.values(gist.files)[0];
            const createdDate = new Date(gist.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            // Try to extract H1 from markdown content, fallback to description, then filename
            let title = "Untitled";

            // First priority: Extract H1 from markdown file content
                        // First priority: Extract H1 from markdown file content
            if (firstFile?.content && firstFile.filename?.endsWith('.md')) {
              const heading = extractFirstHeading(firstFile.content);
              if (heading) {
                title = heading;
              } else if (gist.description) {
                title = gist.description;
              } else if (firstFile.filename) {
                // Remove .md extension from filename
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
                className="block"
              >
                <article className="minimal-card rounded-2xl p-4 border-l-4 border-l-accent/40 hover:border-l-accent transition-all group cursor-pointer">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-foreground group-hover:text-accent mb-1 break-words transition-colors">
                          {title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
                          </div>
                          {firstFile && firstFile.language && (
                            <div className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                              {firstFile.language}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{createdDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File list */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.values(gist.files).map((file) => (
                        <div
                          key={file.filename}
                          className="text-xs px-2 py-0.5 bg-muted/50 rounded-md text-foreground/70 font-mono"
                        >
                          {file.filename}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}

          {filteredGists.length === 0 && (
            <div className="text-center py-12 minimal-card rounded-2xl">
              <p className="text-sm text-muted-foreground">no snippets found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gists;