import { Key, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiMenu, FiChevronDown, FiSearch } from "react-icons/fi";
import { AiFillLike } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoLibrarySharp } from "react-icons/io5";
import { IconType } from "react-icons";
import {
  IconButton,
  Heading,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  Image,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Divider,
  Center,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getCreatedPlaylists } from "../../features/playlists/createdPlaylistsSlice";
import { getCurrentUserProfile } from "../../features/users/currentUserProfileSlice";
import SpotifyLogo from "../../assets/SpotifyLogo.png";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
  id: number;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/home", id: 1 },
  { name: "Search", icon: FiSearch, href: "/search", id: 2 },
  { name: "Your Library", icon: IoLibrarySharp, href: "/home", id: 3 },
  { name: "Create Playlist", icon: CgAddR, href: "javascript:void(0)", id: 4 },
  { name: "Liked Songs", icon: AiFillLike, href: "/liked-songs", id: 5 },
];

function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("#121212", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCreatedPlaylists());
  }, []);

  const { createdPlaylistsData } = useAppSelector(
    (state) => state.createdPlaylists
  );

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("black", "gray.900")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      overflowY={"auto"}
      css={{
        "&::-webkit-scrollbar": {
          width: "15px",
        },
        "&::-webkit-scrollbar-track-piece": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#4d4d4d",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "gray",
        },
      }}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="center">
        <a href="/home">
          <Image
            borderRadius="full"
            height="40px"
            src={SpotifyLogo}
            alt="Spotify Logo"
          />
        </a>
        <CloseButton
          color="white"
          border="1px"
          marginLeft={"10%"}
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.id}
          icon={link.icon}
          fontWeight="bold"
          onClick={() => navigate(`${link.href}`)}
        >
          {link.name}
        </NavItem>
      ))}
      <>
        {createdPlaylistsData && createdPlaylistsData?.total > 0 ? (
          <>
            <Heading
              as="h1"
              fontSize={"12px"}
              color="white"
              marginLeft="20px"
              marginTop="20px"
            >
              PLAYLISTS
            </Heading>
            <Center width="200px" margin="0 auto" marginTop="5px">
              <Divider orientation="horizontal" />
            </Center>
            {createdPlaylistsData?.items.map(
              (item: { id: Key; name: string; collaborative: boolean }) => (
                <Heading
                  key={item.id}
                  p="3"
                  mx="4"
                  as="h1"
                  size="sm"
                  color="gray"
                  fontWeight="medium"
                  display={"flex"}
                  alignItems="center"
                  _hover={{
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/playlist/${item.id}`)}
                >
                  <Box>{item.name}</Box>
                  {item.collaborative ? (
                    <Box marginLeft={"auto"}>
                      <BsFillPeopleFill />
                    </Box>
                  ) : null}
                </Heading>
              )
            )}
          </>
        ) : null}
      </>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="2"
        mx="4"
        borderRadius="lg"
        color="gray"
        role="group"
        cursor="pointer"
        _hover={{
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, []);

  const { currentUserProfileData } = useAppSelector(
    (state) => state.getCurrentUserProfile
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
    window.location.href = "/";
  };

  return (
    <Flex
      pos="fixed"
      width="-webkit-fill-available"
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("black", "gray.900")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        color="white"
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        <a href="/home">
          <Image
            borderRadius="full"
            height="40px"
            src={SpotifyLogo}
            alt="Spotify Logo"
          />
        </a>
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack id={currentUserProfileData?.id}>
                <Avatar
                  name="User Photo"
                  iconLabel="User Photo"
                  size={"md"}
                  src={currentUserProfileData?.images[0].url}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text color="white" fontSize="sm">
                    {currentUserProfileData?.display_name}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown color="white" />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("blackAlpha.900", "gray.900")}
              color={"white"}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem _hover={{ color: "black" }}>
                <a
                  href="https://www.spotify.com/eg-en/account/overview/?utm_source=spotify&utm_medium=menu&utm_campaign=your_account"
                  target="_blank"
                >
                  Account
                </a>
              </MenuItem>
              <MenuItem
                _hover={{ color: "black" }}
                onClick={() => navigate(`/user/${currentUserProfileData?.id}`)}
              >
                Profile
              </MenuItem>
              <MenuItem _hover={{ color: "black" }}>
                <a href="https://open.spotify.com/preferences" target="_blank">
                  Settings
                </a>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                _hover={{ color: "black" }}
                onClick={() => handleLogout()}
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default SidebarWithHeader;
