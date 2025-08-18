import Markdown from "markdown-to-jsx";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ slug: string }>;
};

const getSupabasePublicUrl = (bucketName: string, itemName: string) => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/" +
    bucketName +
    "/" +
    itemName
  );
};

/**
 * Replaces image links with the public image URL.
 */
const parseContent = (content: string) => {
  // replaces images with `![image](<publicUrlLink>)`
  const obsidianImgRegex = /!\[\[(.*?)\]\]/g;
  const markdownRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const regexes = [obsidianImgRegex, markdownRe];

  let replaced = "";
  for (const _ of regexes) {
    replaced = content.replace(obsidianImgRegex, (_, fileName) => {
      const publicUrl = getSupabasePublicUrl("images", fileName);
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
  const postUrl = await supabase.storage.from("content").getPublicUrl(title)
    .data.publicUrl;
  const res = await fetch(postUrl);
  const content = await res.text();

  const parsedContent = parseContent(content);

  return (
    <div>
      <h1>{title}</h1>
      <Markdown>{parsedContent}</Markdown>
    </div>
  );
};

export default Page;
