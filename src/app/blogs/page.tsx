import { Anchor, Stack } from "@mantine/core";
import PageLayout from "@/layouts/PageLayout";
import { getPosts, type Post } from "./utils";

// OLD SUPABASE CODE (commented out)
// import { createClient } from "@/utils/supabase/server";
// import { cookies } from "next/headers";

const Page = async () => {
  // Call getPosts() in the Page component (server-side)
  const posts = await getPosts();

  // OLD SUPABASE CODE (commented out)
  // const cookieStore = await cookies();
  // const supabase = await createClient(cookieStore);
  // const { data } = await supabase.storage.from("content").list();
  // const posts = data?.filter((post) => post.name.endsWith("md"));

  const Posts = ({ posts }: { posts: Post[] }) => {
    return (
      <Stack align="flex-start">
        {posts.map((post, idx) => (
          <Anchor
            href={`/blogs/${encodeURIComponent(post.slug)}`}
            underline="never"
            key={idx}
            className="link"
          >
            {post.title}
          </Anchor>
        ))}
        {/* OLD SUPABASE CODE (commented out) */}
        {/* {posts?.map((post, idx) => (
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
        ))} */}
      </Stack>
    );
  };

  return (
    <PageLayout
      title="Blogs"
      subheader="Sometimes I write about the stuff I learned."
      content={<Posts posts={posts} />}
    />
  );
};

// Force static generation at build time
// getPosts() will be called during build, not at request time
export const dynamic = 'force-static';

export default Page;
