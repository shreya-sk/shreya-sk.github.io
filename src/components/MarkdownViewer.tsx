import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BlogPost } from "@/types/blog";

interface MarkdownViewerProps {
  post: BlogPost | null;
}

const MarkdownViewer = ({ post }: MarkdownViewerProps) => {
  if (!post) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-6xl">📝</div>
          <p className="text-foreground/60 text-sm">
            Select a note from the sidebar to view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      <article className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-foreground/50">
            <span>{post.folder}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* Markdown Content */}
        <div className="prose prose-invert prose-sm md:prose-base max-w-none">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match && !String(children).includes('\n');
                return !isInline && match ? (
                  <SyntaxHighlighter
                    style={oneDark as { [key: string]: React.CSSProperties }}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl my-4"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-sm" {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg md:text-xl font-semibold mt-4 mb-2 text-foreground/90">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="my-4 leading-relaxed text-foreground/80">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="my-4 space-y-2 list-disc list-inside text-foreground/80">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="my-4 space-y-2 list-decimal list-inside text-foreground/80">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-4 italic text-foreground/70 bg-primary/5 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary hover:text-secondary underline underline-offset-2 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-primary/20">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-primary/20 px-4 py-2 bg-primary/10 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-primary/20 px-4 py-2">
                  {children}
                </td>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default MarkdownViewer;
