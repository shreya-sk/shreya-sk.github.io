
import { useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - this will be replaced with actual markdown parsing
const mockPost = {
  title: "Building a Second Brain with Obsidian",
  content: `
# Building a Second Brain with Obsidian

In our information-rich world, the ability to capture, organize, and retrieve knowledge effectively has become a superpower. This is where the concept of building a "Second Brain" comes in, and Obsidian provides an excellent platform for this endeavor.

## What is a Second Brain?

A Second Brain is a personal knowledge management system that extends your biological memory. It's a digital repository where you can:

- Capture ideas and insights
- Connect related concepts
- Build upon previous thoughts
- Create a compound effect of learning

## Why Obsidian?

Obsidian stands out for several reasons:

### 1. Linked Thinking
The ability to create bidirectional links between notes mimics how our brain actually works, creating a web of interconnected knowledge.

### 2. Local Files
Your notes are stored as plain markdown files on your computer, ensuring you always have access and control over your data.

### 3. Extensibility
A rich ecosystem of plugins allows you to customize Obsidian to fit your specific workflow and needs.

## Getting Started

Here's how I structure my Obsidian vault:

1. **Inbox**: Quick capture of new ideas
2. **Areas**: Ongoing responsibilities and interests
3. **Resources**: Reference materials and research
4. **Archive**: Completed projects and old materials

## The Power of Progressive Summarization

One technique I use heavily is progressive summarization:

1. Start with raw notes
2. Bold the most important parts
3. Highlight the most important bold parts
4. Create a summary at the top

This creates layers of information density, making it easier to review and find key insights later.

## Conclusion

Building a Second Brain with Obsidian isn't just about note-taking—it's about creating a thinking partner that grows more valuable over time. The key is consistency and developing a system that works for your unique way of thinking.
  `,
  date: "2024-01-15",
  readTime: "5 min read",
  slug: "building-second-brain-obsidian"
};

const BlogPost = () => {
  const { slug } = useParams();
  
  // In a real implementation, you'd fetch the post based on the slug
  const post = mockPost;

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
        
        <article className="prose prose-gray max-w-none dark:prose-invert">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>
          
          <div className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
