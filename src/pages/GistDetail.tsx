
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGistContent } from "@/services/gistsService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

const GistDetail = () => {
  const { gistId } = useParams();

  const { data: gist, isLoading, error } = useQuery({
    queryKey: ['gist', gistId],
    queryFn: () => fetchGistContent(gistId || ''),
    enabled: !!gistId,
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-8 sage-gradient min-h-screen">
        <div className="mx-auto max-w-3xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gist) {
    return (
      <div className="container px-4 py-8 sage-gradient min-h-screen">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/gists"
            className="inline-flex items-center text-muted-foreground hover:text-accent mb-8 transition-all hover:gap-3 gap-2 font-medium text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Snippets
          </Link>

          <div className="text-center py-12">
            <p className="text-destructive mb-2 text-sm">Gist not found</p>
            <p className="text-muted-foreground text-xs">The gist couldn't be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  const firstFile = Object.values(gist.files)[0];
  const title = gist.description || firstFile?.filename || "Untitled";
  const createdDate = new Date(gist.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="container px-4 py-8 sage-gradient min-h-screen">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/gists"
          className="inline-flex items-center text-muted-foreground hover:text-accent mb-8 transition-all hover:gap-3 gap-2 font-medium text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Snippets
        </Link>

        <article className="minimal-card rounded-3xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4 break-words">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span>{createdDate}</span>
              </div>
              <a
                href={gist.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-foreground/70 hover:bg-muted text-sm transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View on GitHub</span>
              </a>
            </div>
          </header>

          {/* Render each file in the gist */}
          <div className="space-y-8">
            {Object.entries(gist.files).map(([filename, file]) => (
              <div key={filename} className="space-y-3">
                {Object.keys(gist.files).length > 1 && (
                  <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <FileText className="h-4 w-4 text-accent" />
                    <h2 className="text-lg font-semibold text-foreground">{file.filename}</h2>
                    {file.language && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        {file.language}
                      </span>
                    )}
                  </div>
                )}

                <div className="markdown-content">
                  {file.filename.endsWith('.md') ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      className="leading-relaxed"
                    >
                      {file.content || ''}
                    </ReactMarkdown>
                  ) : (
                    <pre className="bg-muted/50 border border-border/50 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{file.content}</code>
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default GistDetail;
