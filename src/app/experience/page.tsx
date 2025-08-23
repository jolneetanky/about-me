import PageLayout from "@/layouts/PageLayout";
import { Center } from "@mantine/core";

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
