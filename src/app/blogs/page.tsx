import { Center, Stack } from "@mantine/core";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data } = await supabase.storage.from("content").list();
  const posts = data?.filter((post) => post.name.endsWith("md"));

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
