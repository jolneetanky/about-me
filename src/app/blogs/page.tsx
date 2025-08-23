import { Center, Stack } from "@mantine/core";
import Link from "next/link";

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
      <Stack>
        {posts?.map((post, idx) => (
          <Link href={`/blogs/${post.name}`} key={idx}>
            {post.name}
          </Link>
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
