import Markdown from "markdown-to-jsx";
import {
  getFileNameFromSlug,
  getObsidianFolderPath,
  getTitleFromFileName,
} from "../utils";
import fs from "fs";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type Props = {
  params: {
    slug: string;
  };
};

type Post = {
  title: string;
  content: string;
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
  for (const reg of regexes) {
    replaced = content.replace(obsidianImgRegex, (_, fileName) => {
      const publicUrl = getSupabasePublicUrl("images", fileName);
      return `![image](${publicUrl})`;
    });
  }

  return replaced;
};

// const parseObsidianToMD = (content: string): string => {
//   // Find text in double brackets
//   const linkRegex = /\[\[([^\]]+)\]\]/g;
//   const imageRegex = /!\[\[([^\]]+)\]\]/g;

//   // Replace double brackets with single bracket links
//   const replacedImagesText = content.replace(
//     imageRegex,
//     "![](/attachments/$1)"
//   );
//   const replacedLinksText = replacedImagesText.replace(linkRegex, "[$1]($1)");

//   return replacedLinksText;
// };

// const getPostContent = (fname: string): string => {
//   const fullPath = getObsidianFolderPath() + "/" + fname;
//   const content = fs.readFileSync(fullPath, "utf-8");
//   const mdContent = parseObsidianToMD(content);

//   return mdContent;
// };

// const getPost = (slug: string): Post => {
//   // for content, we need to parse the file
//   const fname = getFileNameFromSlug(slug);
//   const content = getPostContent(fname);

//   return {
//     title: getTitleFromFileName(fname),
//     content: content,
//   };
// };

const Page = async ({ params }: Props) => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { slug } = params;
  const title = decodeURIComponent(slug);

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
