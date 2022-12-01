import { useEffect } from "react";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import SidebarWithHeader from "../Nav/Nav";
import HomePage from "../HomePage/HomePage";

const CLIENT_ID = import.meta.env.VITE_APP_CLIENT_ID;
const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = window.location.origin + "/home";
const SCOPES = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
  "user-read-private",
  "user-read-playback-position",
  "playlist-read-private",
  "user-library-modify",
  "playlist-read-collaborative",
  "user-follow-read",
  // "playlist-read-public",
  "user-library-read",
  "user-top-read",
  "ugc-image-upload",
  "user-follow-modify",
  "user-modify-playback-state",
  "user-read-recently-played",
];
const SPACE_DELIMITER = "%20";
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const getReturnedParamsFromSpotifyAuth = (hash: string) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce(
    (accumlator: any, currentValue: any) => {
      const [key, value] = currentValue.split("=");
      accumlator[key] = value;
      return accumlator;
    },
    {}
  );
  return paramsSplitUp;
};

const LoginPage = () => {
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("expiresIn", expires_in);
      localStorage.setItem("tokenType", token_type);
      window.location.href = "/home";
    }
  }, []);

  const handleLogin = () => {
    const win: Window = window;
    win.location = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  return (
    <>
      {localStorage.getItem("accessToken") ? (
        <SidebarWithHeader children={<HomePage />} />
      ) : (
        <div style={{ backgroundColor: "#242424" }}>
          <Stack
            as={Box}
            textAlign={"center"}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}
          >
            <Heading
              color={"gray.500"}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Welcome to
              <br />
              <Text as={"span"} color={"green.400"}>
                Spotify Mimic
              </Text>
            </Heading>
            <Text fontSize="20px" color={"gray.500"}>
              In order to view the website and to have full use of its
              functionality, you need to log into Spotify via any method you
              desire.
            </Text>
            <Stack
              direction={"column"}
              spacing={3}
              align={"center"}
              alignSelf={"center"}
              position={"relative"}
            >
              <Button
                color={"blackAlpha"}
                onClick={handleLogin}
                colorScheme={"green"}
                bg={"green.400"}
                rounded={"full"}
                px={6}
                _hover={{
                  bg: "green.500",
                }}
              >
                Log in
              </Button>
            </Stack>
          </Stack>
        </div>
      )}
    </>
  );
};

export default LoginPage;
