import { Anchor, Box, Container, Group, Image } from "@mantine/core";

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
        <Group justify="space-between" align="center" px={50}>
          {/* Left side: your image */}
          <Box>
            <Image
              src="/jolene_image.jpeg"
              alt="My Logo"
              height={40}
              display="block"
              style={{ borderRadius: "50%" }}
            />
            {/* <img
              src="/jolene_image.jpeg" // keep file in /public/jolene_image.jpeg
              alt="My Logo"
              style={{ height: 40, width: "auto", display: "block" }}
            /> */}
          </Box>
          {/* Right side: your links */}
          <Group gap="lg">
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
          {/* Right: placeholder for balance (optional) */}
          <Box style={{ width: 40 }} /> {/* keeps center truly centered */}
        </Group>
      </Container>
    </Box>
  );
};
