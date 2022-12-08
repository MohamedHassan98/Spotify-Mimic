import {
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Box,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getSearchResults } from "../../features/search/getSearchResultsSlice";
import Gridder from "../Gridder/Gridder";
import SidebarWithHeader from "../Nav/Nav";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchIndicator, setSearchIndicator] = useState(false);
  const dispatch = useAppDispatch();
  let { searchData } = useAppSelector((state) => state.getSearchResults);

  let searchParams = window.location.search
    .slice(3, window.location.search.length)
    .split("&");

  const handleChangeSearchName = (event: { target: { value: string } }) => {
    setSearchName(event.target.value);
  };

  const handleChangeType = (event: { target: { value: string } }) => {
    setSearchType(event.target.value);
  };

  const searchHandler = () => {
    if (searchName.length > 0 && searchType.length > 0) {
      if (searchName.indexOf(" ") >= 0) {
        let searchNameSpacer: string = "";
        searchNameSpacer = searchName.replace(" ", "%20");
        navigate(`/search?q=${searchNameSpacer}&type=${searchType}`);
        dispatch(
          getSearchResults({
            searchName: searchNameSpacer,
            searchType,
          })
        );
      } else {
        navigate(`/search?q=${searchName}&type=${searchType}`);
        dispatch(getSearchResults({ searchName, searchType }));
      }
      setSearchIndicator(!searchIndicator);
    }
  };

  useEffect(() => {
    if (window.location.search.length > 0) {
      setSearchIndicator(true);
      setSearchName(searchParams[0]);
      setSearchType(searchParams[1].slice(5, searchParams[1].length));
      dispatch(
        getSearchResults({
          searchName: searchParams[0],
          searchType: searchParams[1].slice(5, searchParams[1].length),
        })
      );
    } else setSearchIndicator(false);
  }, [searchIndicator]);

  return (
    <>
      <SidebarWithHeader
        children={
          <Stack marginLeft="0px" marginTop="80px" spacing={6}>
            <InputGroup gap="30px" flexDir={"row"} flexWrap="wrap">
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="blackAlpha.700" />}
              />
              <Input
                defaultValue={searchName}
                onChange={handleChangeSearchName}
                borderRadius={"25px"}
                width={{
                  base: "100%",
                  sm: "70%",
                  md: "60%",
                  lg: "45%",
                  xl: "20%",
                }}
                bgColor="white"
                placeholder="What do you want to listen to?"
              />
              <Select
                defaultValue={searchParams[1]?.slice(5, searchParams[1].length)}
                bgColor="white"
                width={{
                  base: "50%",
                  sm: "40%",
                  md: "50%",
                  lg: "25%",
                  xl: "10%",
                }}
                placeholder="Select option"
                onChange={handleChangeType}
              >
                <option value="track">Track</option>
                <option value="artist">Artist</option>
                <option value="playlist">Playlist</option>
                <option value="album">Album</option>
              </Select>
              <Button
                borderRadius={"50px"}
                bgColor={"lightgreen"}
                color="black"
                onClick={() => searchHandler()}
              >
                Search
              </Button>
            </InputGroup>
            <Box>
              {searchIndicator ? (
                <Gridder
                  GridType={searchType}
                  GridHeader="Search Results"
                  GridSeeAll={false}
                  GridData={
                    searchData ? searchData[Object.keys(searchData)[0]] : null
                  }
                />
              ) : null}
            </Box>
          </Stack>
        }
      />
    </>
  );
};

export default SearchPage;
