import { Anchor, Avatar, Box, Container, Group } from "@mantine/core";

const NavbarStyle = {
  background: "#31087B",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
  height: "10vh", // navbar height
};

const navbarItems = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "Experience", href: "/experience" },
  { title: "Blogs", href: "/blogs" },
];

export const Navbar = () => {
  return (
    <Box style={NavbarStyle}>
      <Container size="md" h="100%">
        <Group h="100%" justify="space-between" align="center">
          {/* Left: avatar */}
          <Avatar
            src="/jolene_image.jpeg"
            alt="Jolene"
            size={48}
            radius="xl" // true circle
          />

          {/* Right: nav links */}
          <Group gap="md">
            {navbarItems.map((item) => (
              <Anchor
                key={item.href}
                href={item.href}
                underline="never"
                c="white"
                fw={500}
                style={{ lineHeight: 1 }}
                className="navbar-link"
              >
                {item.title}
              </Anchor>
            ))}
          </Group>

          {/* Right spacer (balances avatar width) */}
          <Box style={{ width: 36 }} />
        </Group>
      </Container>
    </Box>
  );
};

// import { Anchor, Box, Container, Group, Image } from "@mantine/core";

// const NavbarStyle = {
//   background: "#31087B",
//   boxShadow: "0 4px 16px 0 rgba(0,0,0,0.25)",
// };

// const navbarItems = [
//   {
//     title: "Home",
//     href: "/",
//   },
//   {
//     title: "Projects",
//     href: "/projects",
//   },
//   {
//     title: "Experience",
//     href: "/experience",
//   },
//   {
//     title: "Blogs",
//     href: "/blogs",
//   },
// ];

// // navbar
// export const Navbar = () => {
//   return (
//     <Box style={NavbarStyle}>
//       <Container size="md" py="xs">
//         <Group justify="space-between" align="center" px={50}>
//           {/* Left side: your image */}
//           <Box>
//             <Image
//               src="/jolene_image.jpeg"
//               alt="My Logo"
//               width={40}
//               height={40}
//               radius="xl"
//               fit="cover"
//               display="block"
//             />
//             {/* <img
//               src="/jolene_image.jpeg" // keep file in /public/jolene_image.jpeg
//               alt="My Logo"
//               style={{ height: 40, width: "auto", display: "block" }}
//             /> */}
//           </Box>
//           {/* Right side: your links */}
//           <Group gap="lg">
//             {navbarItems.map((item, idx) => (
//               <Anchor
//                 href={item.href}
//                 size="lg"
//                 underline="never"
//                 c="white"
//                 className="navbar-link"
//                 key={idx}
//               >
//                 {item.title}
//               </Anchor>
//             ))}
//           </Group>
//           {/* Right: placeholder for balance (optional) */}
//           <Box style={{ width: 40 }} /> {/* keeps center truly centered */}
//         </Group>
//       </Container>
//     </Box>
//   );
// };
