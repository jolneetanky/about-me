import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Box, Center } from "@mantine/core";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Replaces image links with the public image URL.
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

const Page = async ({ params }: Props) => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { slug } = await params;
  const title = decodeURIComponent(slug);

  // Get supabase public URL for the post, and fetch
  const postUrl = supabase.storage.from("content").getPublicUrl(title)
    .data.publicUrl;
  const res = await fetch(postUrl);
  const content = await res.text();

  const parsedContent = parseContent(content);

  return (
    <Box style={{ height: "100%", width: "100%" }} mx={8}>
      <div>
        <h1>{title}</h1>
        <ReactMarkdown
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
            code: ({ node, className, children, ...props }) => (
              <code
                style={{
                  background: "#514a4aff", // light gray background
                  color: "white",
                  borderRadius: "4px",
                  overflowX: "auto",
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                }}
                {...props}
              >
                {children}
              </code>
            ),
          }}
        >
          {parsedContent}
        </ReactMarkdown>
      </div>
    </Box>
  );
};

export default Page;
