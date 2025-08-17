import Markdown from "markdown-to-jsx";
import {
  getFileNameFromSlug,
  getObsidianFolderPath,
  getTitleFromFileName,
} from "../utils";
import fs from "fs";

type Props = {
  params: {
    slug: string;
  };
};

type Post = {
  title: string;
  content: string;
};

const parseObsidianToMD = (content: string): string => {
  // Find text in double brackets
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const imageRegex = /!\[\[([^\]]+)\]\]/g;

  // Replace double brackets with single bracket links
  const replacedImagesText = content.replace(
    imageRegex,
    "![](/attachments/$1)"
  );
  const replacedLinksText = replacedImagesText.replace(linkRegex, "[$1]($1)");

  return replacedLinksText;
};

const getPostContent = (fname: string): string => {
  const fullPath = getObsidianFolderPath() + "/" + fname;
  const content = fs.readFileSync(fullPath, "utf-8");
  const mdContent = parseObsidianToMD(content);

  return mdContent;
};

const getPost = (slug: string): Post => {
  // for content, we need to parse the file
  const fname = getFileNameFromSlug(slug);
  const content = getPostContent(fname);

  return {
    title: getTitleFromFileName(fname),
    content: content,
  };
};

const Page = ({ params }: Props) => {
  const { slug } = params;

  const post = getPost(slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <Markdown>{post.content}</Markdown>
    </div>
  );
};

export default Page;
