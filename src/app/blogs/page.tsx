import { Center, Stack } from "@mantine/core";
import Link from "next/link";
import fs from "fs";
import { getObsidianFolderPath, getTitleFromFileName } from "./utils";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// parse files in folder, and return titles
// const getPostMetadata = () => {
//   const folderPath = getObsidianFolderPath();

//   try {
//     const files = fs.readdirSync(folderPath);
//     const mdFiles = files.filter((file) => file.endsWith("md"));
//     const res = mdFiles.map((file) => ({
//       title: getTitleFromFileName(file), // remove ".md" lol
//     }));
//     return res;
//   } catch (err) {
//     console.log("Failed to get posts", err);
//     return [];
//   }
// };

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  //   console.log("HII", await supabase.storage.listBuckets());
  //   console.log("HII", await supabase.from("blogs").select());

  const { data: posts } = await supabase.storage.from("content").list();

  //   console.log("HIII", posts);

  //   console.log("HII", posts, error);

  //   const { data, error } = await supabase.storage
  //     .from("content")
  //     .download("blog 1.md");
  //   console.log(await data?.text());

  //   const posts = getPostMetadata();

  // fetch post titles?

  return (
    <Center>
      <Stack>
        {posts?.map((post, idx) => (
          <Link href={`/blogs/${post.name}`} key={idx}>
            {post.name}
          </Link>
        ))}
      </Stack>
    </Center>
  );
};

export default Page;
