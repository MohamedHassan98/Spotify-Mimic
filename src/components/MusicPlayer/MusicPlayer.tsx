import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";
import ReactHowler from "react-howler";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useTypedSelector";
import NoImage from "../../assets/NoImage.png";

export default function SmallWithLogoLeft() {
  const [playbackState, setplaybackState] = useState(false);
  const [volumeState, setvolumeState] = useState(100);
  const ref = useRef<any>(null);
  const { songObject } = useAppSelector((state) => state.newSongPlaying);
  const navigate = useNavigate();

  return (
    <Box
      bg={"black"}
      color={"gray.200"}
      position={"fixed"}
      bottom="0%"
      width="100%"
      zIndex={20}
    >
      <Container
        as={Flex}
        maxW="10xl"
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-evenly" }}
        align={{ base: "center", md: "center" }}
      >
        <Grid
          templateRows={{ base: "none", md: "repeat(2, 1fr)" }}
          templateColumns={{ base: "1fr", md: "80px 1fr" }}
          gap={{ base: 1, md: 5 }}
          width={{ base: "100%", md: "30%" }}
          textAlign={{ base: "center", md: "start" }}
        >
          <GridItem
            rowSpan={{ base: 1, md: 2 }}
            display="flex"
            justifyContent={{ base: "center", md: "flex-start" }}
          >
            <img
              src={songObject?.songURI ? songObject?.songImage : NoImage}
              style={{ height: "80px" }}
            />
          </GridItem>
          <GridItem colSpan={1}>
            <h1>{songObject?.songURI ? songObject.songName : "No Song"}</h1>
          </GridItem>
          <GridItem colSpan={1}>
            <h1>
              {songObject?.songURI
                ? songObject?.songArtists.map(
                    (
                      artist: { id: string; name: string },
                      idx: number,
                      arr: []
                    ) => (
                      <span
                        key={artist.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                      >
                        {arr.length - 1 === idx
                          ? artist.name
                          : artist.name + ", "}
                      </span>
                    )
                  )
                : null}
            </h1>
          </GridItem>
        </Grid>
        <>
          <Grid
            width={{ base: "100%", md: "50%" }}
            h={{ base: "95px" }}
            templateRows="1fr 1fr"
            templateColumns="repeat(9, 1fr)"
            alignSelf={"center"}
            gap={2}
            py={3}
          >
            <GridItem margin={"0 auto"} colSpan={9}>
              <Button
                height="30px"
                colorScheme="green"
                onClick={() => setplaybackState(!playbackState)}
              >
                {playbackState ? "Pause" : "Play"}
              </Button>
            </GridItem>
            <GridItem
              colSpan={1}
              fontSize="12px"
              display={"flex"}
              justifyContent="flex-end"
              alignItems={"center"}
            >
              <h1>
                {ref.current?._howler._duration > 0
                  ? `0:${ref.current?._howler._duration.toFixed(0)}`
                  : null}
              </h1>
            </GridItem>
            <GridItem colSpan={7} margin={"auto 0"}>
              <RangeSlider
                defaultValue={[100]}
                isDisabled={true}
                colorScheme="green"
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
              </RangeSlider>
            </GridItem>
            {ref.current?._howler._duration > 0 ? (
              <GridItem
                colSpan={1}
                fontSize="12px"
                display={"flex"}
                alignItems="center"
              >
                <h1>{`0:${ref.current?._howler._duration.toFixed(0)}`}</h1>
              </GridItem>
            ) : null}
          </Grid>
          <ReactHowler
            ref={ref}
            src={[songObject?.songURI!]}
            playing={playbackState}
            mute={volumeState === 0 ? true : false}
            volume={volumeState / 100}
            format={["mp3"]}
          />
        </>
        <Flex
          width={{ base: "150px", md: "10%" }}
          flexDirection={"row"}
          justifyContent="center"
          alignItems={"center"}
          gap={2}
        >
          <h1>
            {volumeState > 0 ? (
              <BsFillVolumeUpFill
                size="25px"
                onClick={() => setvolumeState(0)}
              />
            ) : (
              <BsFillVolumeMuteFill
                size="25px"
                onClick={() => setvolumeState(100)}
              />
            )}
          </h1>
          <RangeSlider
            defaultValue={[100]}
            value={[volumeState]}
            onChange={(val) => setvolumeState(val[0])}
            colorScheme="green"
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
          </RangeSlider>
        </Flex>
      </Container>
    </Box>
  );
}
