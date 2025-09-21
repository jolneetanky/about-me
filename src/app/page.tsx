import { ActionIcon, Anchor, Center, Group, Stack, Text } from "@mantine/core";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

export default function Home() {
  return (
    <Center className="">
      <Stack gap="sm" maw={700}>
        <Text size="lg" fw={500}>
          Hi, I’m Jolene :)
        </Text>
        <Text>
          Currently pursuing a B.Comp in Computer Science at the National
          University of Singapore.
        </Text>
        <Text>
          I love building things and seeing how I can make different ideas come
          to life through code. I love learning new things and deepening my
          technical knowledge. These days I&apos;m learning C++ and building
          systems projects.
        </Text>
        <Text>
          Outside of code, I also love picking up a good book every now and
          then!
        </Text>

        {/* Icons */}
        {/* Social icons below text */}
        <Group gap="md" mt="sm">
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
    </Center>
  );
}
