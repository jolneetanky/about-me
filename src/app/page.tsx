// brief introduction about me

import { ActionIcon, Anchor, Center, Group, Stack, Text } from "@mantine/core";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

export default function Home() {
  return (
    <Center>
      <Stack gap="sm" maw={700}>
        <Text size="lg" fw={500}>
          Hi, I’m Jolene :)
        </Text>
        <Text>
          I’m currently pursuing a B.Comp in Computer Science at the National
          University of Singapore.
        </Text>
        <Text>
          I started from building web apps, but over time I got more interested
          in what happens under the hood, the kind of programming that deals
          with how things actually work. These days I’m exploring systems
          programming with C++, working on side projects that push me to write
          faster, cleaner, and more reliable code.
        </Text>
        <Text>
          Outside of code, I love finding new shows to watch and picking up a
          good book every now and then.
        </Text>
      </Stack>

      {/* Icons */}
      {/* Social icons below text */}
      <Group gap="md" mt="sm">
        <Anchor
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionIcon size="lg" variant="subtle" aria-label="GitHub">
            <IconBrandGithub size={24} />
          </ActionIcon>
        </Anchor>

        <Anchor
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionIcon size="lg" variant="subtle" aria-label="LinkedIn">
            <IconBrandLinkedin size={24} />
          </ActionIcon>
        </Anchor>
      </Group>
    </Center>
  );
}
