import ReactMarkdown from "react-markdown";
import { Box } from "@mantine/core";
import { getPostBySlug, type Post } from "../utils";

import remarkGfm from "remark-gfm"; // for github flavored MD
import rehypeRaw from "rehype-raw"; // for formatting code?
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

// This page is only responsible for taking in an MD string and rendering it cleanly.
type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  
  // Get the full Post object (no need to recompute reading time, read file, etc.)
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Use the Post object directly - all fields are already computed
  const { title, content, readingTime, createdAtDate, lastEditedDate } = post;

  // const parsedContent = parseContent(content);

  // code component for React MD
  const codeComponent = ({
    inline,
    className,
    children,
    style, // destructure to omit
    ...props
  }: React.HTMLAttributes<HTMLElement> & {
    inline?: boolean;
  }) => {
    const match = /language-(\w+)/.exec(className || "");

    return !inline && match ? (
      <SyntaxHighlighter
        style={dracula}
        PreTag="div"
        language={match[1]}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      // if no language specified (eg. for inline code), fallback to a simple code block
      <code
        className={className}
        {...props}
        style={{
          background: "rgba(243, 239, 239, 0.18)",
          padding: "0.15rem 0.4rem",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "0.9em",
        }}
      >
        {children}
      </code>
    );
  };

  return (
    <Box style={{ height: "100%", width: "100%" }}>
      <article className="blog-post">
        <header className="blog-header">
          <h1>{title}</h1>
          {(createdAtDate || readingTime) && (
            <div className="blog-meta">
              {createdAtDate && (
                <span>
                  <span className="blog-meta-label">Created At:</span>{" "}
                  <time dateTime={createdAtDate.toISOString()}>
                    {createdAtDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
              )}
              {lastEditedDate && (
                <span>
                  <span className="blog-meta-label">Last Modified At:</span>{" "}
                  <time dateTime={lastEditedDate.toISOString()}>
                    {lastEditedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
              )}
              {readingTime > 0 && (
                <span className="blog-meta-label">{readingTime} min read</span>
              )}
            </div>
          )}
        </header>
        <div className="blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => <h1 {...props} />,
              h2: ({ node, ...props }) => <h2 {...props} />,
              h3: ({ node, ...props }) => <h3 {...props} />,
              h4: ({ node, ...props }) => <h4 {...props} />,
              p: ({ node, ...props }) => <p {...props} />,
              a: ({ node, ...props }) => <a {...props} />,
              ul: ({ node, ...props }) => <ul {...props} />,
              ol: ({ node, ...props }) => <ol {...props} />,
              li: ({ node, ...props }) => <li {...props} />,
              blockquote: ({ node, ...props }) => <blockquote {...props} />,
              hr: ({ node, ...props }) => <hr {...props} />,
              table: ({ node, ...props }) => <table {...props} />,
              thead: ({ node, ...props }) => <thead {...props} />,
              tbody: ({ node, ...props }) => <tbody {...props} />,
              tr: ({ node, ...props }) => <tr {...props} />,
              th: ({ node, ...props }) => <th {...props} />,
              td: ({ node, ...props }) => <td {...props} />,
              strong: ({ node, ...props }) => <strong {...props} />,
              em: ({ node, ...props }) => <em {...props} />,
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="blog-image"
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              ),
              code: codeComponent,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </Box>
  );
};

export default Page;
