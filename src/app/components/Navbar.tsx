import { Anchor, Box, Container, Group } from "@mantine/core";

const NavbarStyle = {
  background: "#31087B",
  boxShadow: "0 4px 16px 0 rgba(0,0,0,0.25)",
};

const navbarItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Experience",
    href: "/experience",
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
];

// navbar
export const Navbar = () => {
  return (
    <Box style={NavbarStyle}>
      <Container size="md" py="md">
        <Group justify="space-between" px={50}>
          {navbarItems.map((item, idx) => (
            <Anchor
              href={item.href}
              size="lg"
              underline="never"
              c="white"
              className="navbar-link"
              key={idx}
            >
              {item.title}
            </Anchor>
          ))}
        </Group>
      </Container>
    </Box>
  );
};
