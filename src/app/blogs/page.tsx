import { Center, Stack } from "@mantine/core";
import Link from "next/link";
import fs from "fs";
import { getObsidianFolderPath, getTitleFromFileName } from "./utils";

// parse files in folder, and return titles
const getPostMetadata = () => {
  const folderPath = getObsidianFolderPath();

  try {
    const files = fs.readdirSync(folderPath);
    const mdFiles = files.filter((file) => file.endsWith("md"));
    const res = mdFiles.map((file) => ({
      title: getTitleFromFileName(file), // remove ".md" lol
    }));
    return res;
  } catch (err) {
    console.log("Failed to get posts", err);
    return [];
  }
};

const Page = () => {
  const posts = getPostMetadata();

  return (
    <Center>
      <Stack>
        {posts.map((post, idx) => (
          <Link href={`/blogs/${post.title}`} key={idx}>
            {post.title}
          </Link>
        ))}
      </Stack>
    </Center>
  );
};

export default Page;
