import { Anchor, Stack } from "@mantine/core";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import PageLayout from "@/layouts/PageLayout";

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data } = await supabase.storage.from("content").list();
  const posts = data?.filter((post) => post.name.endsWith("md"));

  const Posts = () => {
    return (
      // align-items: "flex-start" => each child's width becomes as wide as its content
      <Stack align="flex-start">
        {posts?.map((post, idx) => (
          <Anchor
            href={`/blogs/${post.name}`}
            underline="never"
            key={idx}
            className="link"
          >
            {post.name.endsWith(".md")
              ? post.name.substring(0, post.name.length - 3)
              : post.name}
          </Anchor>
        ))}
      </Stack>
    );
  };

  return (
    <PageLayout
      title="Blogs"
      subheader="Sometimes I write about the stuff I learned."
      content={<Posts />}
    />
  );
};

export default Page;
