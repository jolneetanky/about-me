import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { client } from "../../../tina/__generated__/client";

// /**
//  * Returns the folder path of my Obsidian vault.
//  */
// export const getObsidianFolderPath = () => {
//   return process.env.OBSIDIAN_ROOT_PATH + "/" + process.env.FOLDER_PATH;
// };

/**
 * Transforms a .md file name into title format.
 * @param title The full title including ".md"
 * Returns a title in the
 */
export const getTitleFromFileName = (fname: string) => {
  if (!fname.endsWith(".md")) {
    throw new Error(
      '[transformFileNameToTitle()] File name needs to end with ".md"',
    );
  }

  return fname.substring(0, fname.length - 3); // remove ".md" at the back
};

/**
 * Transforms from title format to .md file name.
 */
export const getFileNameFromSlug = (slug: string) => {
  const res = decodeURIComponent(slug);
  return res + ".md";
};

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export type Post = {
  title: string;
  slug: string; // filename for URL routing
  createdAtDate: Date;
  lastEditedDate: Date;
  readingTime: number;
  content: any;
};

export async function getPosts(): Promise<Post[]> {
  const postsList = await client.queries.blogsConnection();
  const edges = postsList.data.blogsConnection.edges;

  // flatmap to handle null nodes safely
  const posts: Post[] =
    edges?.flatMap((edge) => {
      const node = edge?.node;
      if (!node) return [];

      return [
        {
          title: node.title,
          slug: node._sys.filename,
          createdAtDate: node.createdAt
            ? new Date(node.createdAt)
            : new Date(0),
          lastEditedDate: node.updatedAt
            ? new Date(node.updatedAt)
            : new Date(0),
          readingTime: calculateReadingTimeFromBody(node.body),
          content: node.body ?? "",
        },
      ];
    }) ?? [];

  // Read blog files from blogs directory
  // const blogsDir = join(process.cwd(), "content/blog");
  // const files = await readdir(blogsDir);
  // const mdFiles = files.filter((file) => file.endsWith(".md"));

  // // Get metadata and content for each post
  // const posts = await Promise.all(
  //   mdFiles.map(async (file) => {
  //     const filePath = join(blogsDir, file);
  //     const fileContent = await readFile(filePath, "utf-8");
  //     const { data: frontmatter, content } = matter(fileContent);

  //     // Get file stats for dates
  //     // const stats = await stat(filePath);
  //     // const createdAtDate = stats.birthtime;
  //     // const lastEditedDate = stats.mtime;
  //     const createdAtDate = new Date(frontmatter.createdAt);
  //     const lastEditedDate = new Date(frontmatter.updatedAt);

  //     console.log("HII", frontmatter);

  //     // Calculate reading time
  //     const readingTime = calculateReadingTime(content);

  //     // Extract title from frontmatter or filename
  //     const title = frontmatter.title || file.replace(".md", "");

  //     return {
  //       title,
  //       slug: file, // Use filename as slug for routing
  //       createdAtDate,
  //       lastEditedDate,
  //       readingTime,
  //       content,
  //     };
  //   }),
  // );

  // Sort by last edited date (newest first)
  return posts.sort((a, b) => {
    return b.createdAtDate.getTime() - a.createdAtDate.getTime();
  });
}

function extractTextFromRichText(node: any): string {
  if (!node) return "";

  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map(extractTextFromRichText).join(" ");
  }

  if (typeof node === "object") {
    return extractTextFromRichText(node.children);
  }

  return "";
}

function calculateReadingTimeFromBody(body: any): number {
  const text = extractTextFromRichText(body);
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  const decodedSlug = decodeURIComponent(slug);

  // Find post by matching slug (filename)
  const post = posts.find((p) => {
    // Handle both with and without .md extension
    const postSlug = p.slug;
    const searchSlug = decodedSlug.endsWith(".md")
      ? decodedSlug
      : `${decodedSlug}.md`;

    return postSlug === searchSlug || postSlug === decodedSlug;
  });

  return post || null;
}
