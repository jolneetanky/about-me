import PageLayout from "@/layouts/PageLayout";
import React, { JSX } from "react";

// pulls projects from Supabase and displays them

const Projects = (): JSX.Element => {
  return <>Projects</>;
};

const Page = (): JSX.Element => {
  return (
    <PageLayout
      content={<Projects />}
      title="Projects"
      subheader="A list of projects that I'm proud of. See more on my GitHub."
    />
  );
};

export default Page;
