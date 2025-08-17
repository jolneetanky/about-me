/**
 * Returns the folder path of my Obsidian vault.
 */
export const getObsidianFolderPath = () => {
  return process.env.OBSIDIAN_ROOT_PATH + "/" + process.env.FOLDER_PATH;
};

/**
 * Transforms a .md file name into title format.
 * @param title The full title including ".md"
 * Returns a title in the
 */
export const getTitleFromFileName = (fname: string) => {
  if (!fname.endsWith(".md")) {
    throw new Error(
      '[transformFileNameToTitle()] File name needs to end with ".md"'
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
