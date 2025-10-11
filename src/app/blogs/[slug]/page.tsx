import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
// import type { CodeComponent } from "react-markdown/lib/ast-to-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Box } from "@mantine/core";

import remarkGfm from "remark-gfm"; // for github flavored MD
import rehypeRaw from "rehype-raw"; // for formatting code?
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * TODO: factor this out to our `blogs` repo
 * Parse ObsidianMD to MD.
 * 1) Replaces image links with the public image URL.
 */
const parseContent = (content: string) => {
  const obsidianImgRegex = /!\[\[(.*?)\]\]/g;
  const markdownRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const regexes = [obsidianImgRegex, markdownRe];

  let replaced = "";
  for (const _ of regexes) {
    replaced = content.replace(obsidianImgRegex, (_, fileName) => {
      const publicUrl = encodeURI(
        process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET + "/" + fileName
      );
      return `![image](${publicUrl})`;
    });
  }

  return replaced;
};

// TODO: make code block display nice
// is Obsidian code block aligned with md code block? Do I need my own thingy lol
const Page = async ({ params }: Props) => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { slug } = await params;
  const title = decodeURIComponent(slug);

  let displayTitle = "";
  if (title.endsWith(".md")) {
    displayTitle = title.slice(0, title.length - 3);
  }

  // Get supabase public URL for the post, and fetch
  const postUrl = supabase.storage.from("content").getPublicUrl(title)
    .data.publicUrl;
  const res = await fetch(postUrl);
  const content = await res.text();

  const parsedContent = parseContent(content);

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
    <Box style={{ height: "100%", width: "100%" }} mx={8}>
      <div>
        <h1>{displayTitle}</h1>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                style={{
                  display: "block",
                  maxWidth: "100%",
                  height: "auto",
                  margin: "1rem 0",
                }}
                // optional: ensure it doesn't sit inline with text
              />
            ),
            // Optional: ensure paragraphs don’t collapse with images
            p: ({ node, ...props }) => (
              <p style={{ margin: "1rem 0" }} {...props} />
            ),
            code: codeComponent,
          }}
        >
          {parsedContent}
        </ReactMarkdown>
      </div>
    </Box>
  );
};

export default Page;
