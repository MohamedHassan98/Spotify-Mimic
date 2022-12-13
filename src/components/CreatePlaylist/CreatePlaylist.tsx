import { Stack, Input, InputGroup, Checkbox, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useTypedSelector";
import { createPlaylist } from "../../features/playlist/createPlaylist";
import SidebarWithHeader from "../Nav/Nav";

const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [playlistName, setplaylistName] = useState("My Playlist");
  const [playlistDescription, setplaylistDescription] = useState("");
  const [publicBool, setpublicBool] = useState(false);
  const [collaborativeBool, setcollaborativeBool] = useState(false);

  const handlePlaylistName = (event: { target: { value: string } }) => {
    setplaylistName(event.target.value);
  };

  const handlePlaylistDescription = (event: { target: { value: string } }) => {
    setplaylistDescription(event.target.value);
  };

  const handleChangePublic = (event: { target: { checked: boolean } }) => {
    setpublicBool(event.target.checked);
  };

  const handleChangeCollaborative = (event: {
    target: { checked: boolean };
  }) => {
    setcollaborativeBool(event.target.checked);
  };

  const handleSubmitPlaylist = () => {
    dispatch(
      createPlaylist({
        playlistName: playlistName,
        playlistDescription: playlistDescription,
        playlistPublic: publicBool,
        playlistCollaborative: collaborativeBool,
      })
    );
    navigate("/home");
  };

  return (
    <>
      <SidebarWithHeader
        children={
          <Stack marginLeft="0px" marginTop="80px" spacing={6}>
            <InputGroup gap="30px" flexDir={"row"} flexWrap="wrap">
              <Input
                defaultValue={playlistName}
                onChange={handlePlaylistName}
                borderRadius={"25px"}
                width={{
                  base: "100%",
                  sm: "70%",
                  md: "60%",
                  lg: "45%",
                  xl: "15%",
                }}
                bgColor="white"
                placeholder="Playlist name"
              />
              <Input
                defaultValue={playlistDescription}
                onChange={handlePlaylistDescription}
                borderRadius={"25px"}
                width={{
                  base: "100%",
                  sm: "70%",
                  md: "60%",
                  lg: "45%",
                  xl: "24%",
                }}
                bgColor="white"
                placeholder="Playlist description"
              />
              <Checkbox onChange={handleChangePublic} color="white">
                Public
              </Checkbox>
              <Checkbox onChange={handleChangeCollaborative} color="white">
                Collaborative
              </Checkbox>
              <Button
                borderRadius={"50px"}
                bgColor={"lightgreen"}
                color="black"
                onClick={handleSubmitPlaylist}
              >
                Create
              </Button>
            </InputGroup>
          </Stack>
        }
      />
    </>
  );
};

export default SearchPage;
