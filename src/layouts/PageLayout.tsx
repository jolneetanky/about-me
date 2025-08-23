import {
  ActionIcon,
  Anchor,
  Box,
  Center,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

const TitleText = ({
  title,
  subheader,
}: {
  title: string;
  subheader?: string;
}) => {
  return (
    <Stack>
      <Title order={2}>{title}</Title>
      {subheader && (
        <Text c="dimmed" mt={-12}>
          {subheader}
        </Text>
      )}

      <Group gap="md" mt={-12}>
        <Anchor
          href="https://github.com/jolneetanky"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionIcon size="lg" variant="subtle" aria-label="GitHub">
            <IconBrandGithub size={24} />
          </ActionIcon>
        </Anchor>

        <Anchor
          href="https://linkedin.com/in/jolenetanky"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionIcon size="lg" variant="subtle" aria-label="LinkedIn">
            <IconBrandLinkedin size={24} />
          </ActionIcon>
        </Anchor>
      </Group>
    </Stack>
  );
};

const PageLayout = ({
  content,
  title,
  subheader,
}: {
  content: React.ReactNode;
  title: string;
  subheader: string;
}) => {
  return (
    <Center style={{ height: "100%", width: "100%" }}>
      <Stack h="100%" w="100%" px="md" py="md">
        <TitleText title={title} subheader={subheader} />
        <Box mt={-2}>{content}</Box>
      </Stack>
    </Center>
  );
};

export default PageLayout;
