import PageLayout from "@/layouts/PageLayout";

const Page = () => {
  const Experience = () => {
    return <>This section is in progress :-)</>;
  };

  return (
    <PageLayout
      title="Experience"
      subheader="A timeline of my work experiences."
      content={<Experience />}
    />
  );
};

export default Page;
