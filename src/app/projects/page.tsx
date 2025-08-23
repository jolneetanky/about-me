import PageLayout from "@/layouts/PageLayout";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import React, { JSX } from "react";
import Image from "next/image";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Markdown from "react-markdown";
import { IconBrandGithub } from "@tabler/icons-react";

import "./projects.css";

// pulls projects from Supabase and displays them
type ProjectStatus = "wip" | "refining" | "done" | "closed";

type Project = {
  title: string;
  status: "wip" | "refining" | "done" | "closed";
  imageLink?: string; // image link
  description?: string;
  githubLink: string; // github link
};

const statusProps: Record<
  ProjectStatus,
  { label: string; color: string; tooltip: string }
> = {
  wip: { label: "WIP", color: "yellow", tooltip: "Actively being worked on" },
  refining: {
    label: "Refining",
    color: "blue",
    tooltip: "Polishing / iterating",
  },
  done: {
    label: "Done",
    color: "green",
    tooltip: "Finished, may evolve later",
  },
  closed: {
    label: "Closed",
    color: "gray",
    tooltip: "Finalized; no further changes",
  },
};

const ProjectCard = ({ project }: { project: Project }): JSX.Element => {
  const height = 360;
  const bannerHeight = Math.round(height * 0.25); // ~1/5 of card

  const sp = statusProps[project.status];

  return (
    <Card withBorder radius="lg" shadow="sm" p="md" h={360}>
      {/* Top banner image */}
      {project.imageLink && (
        <Box
          style={{
            height: bannerHeight,
            width: "100%",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          <img
            src={project.imageLink}
            alt={`${project.title} banner`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* Title + GitHub */}
      <Group justify="space-between" mb="xs" align="center">
        <Group align="center" gap="sm">
          <Text fw={600} size="xl">
            {project.title}
          </Text>
          <Badge color={sp.color} variant="light" radius="sm" tt="uppercase">
            {sp.label}
          </Badge>
        </Group>
        {/* <Text fw={600} size="xl">
          {project.title}
        </Text> */}
        <ActionIcon
          component="a"
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          variant="subtle"
          aria-label="GitHub"
        >
          <IconBrandGithub size={22} />
        </ActionIcon>
      </Group>

      {/* Markdown description */}
      <Box
        style={{
          overflow: "auto",
          // leave space below the banner; the rest of the card can scroll if long
          height: project.imageLink ? height - bannerHeight - 72 : height - 56,
        }}
        // mt={-20}
      >
        {project.description ? (
          <div className="md-desc">
            <Markdown>{project.description}</Markdown>
          </div>
        ) : (
          <Text c="dimmed" size="sm">
            No description provided.
          </Text>
        )}
      </Box>
    </Card>
  );
};

const Projects = ({ projects }: { projects: Project[] }): JSX.Element => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {projects.map((p, idx) => (
        <ProjectCard key={idx} project={p} />
      ))}
    </SimpleGrid>
  );
};

const Page = async (): Promise<JSX.Element> => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: supabaseProjects, error } = await supabase
    .from("projects")
    .select();

  const projects: Project[] =
    supabaseProjects?.map((project) => ({
      title: project.title,
      imageLink: project.image_link ?? "",
      description: project.description ?? "",
      githubLink: project.github_link,
      status: project.status,
    })) ?? [];

  return (
    <PageLayout
      content={<Projects projects={projects} />}
      title="Projects"
      subheader="A list of projects I worked on that I'm proud of. See more on my GitHub."
    />
  );
};

export default Page;
