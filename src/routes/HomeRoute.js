import {
	Box,
	Center,
	Heading,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	useColorMode,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { memo } from "react";
import { BiArrowFromRight } from "react-icons/bi";
import { FaMoon, FaRunning, FaSun, FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Map from "../components/Map/Map";
import Stats from "../components/Stats/Stats";
import { useAuth } from "../context/AuthProvider";
import { setMapDrawer } from "../store/map/map";

function HomeRoute(props) {
	const { colorMode, toggleColorMode } = useColorMode();
	const bg = useColorModeValue("gray.400", "gray.900");
	const color = useColorModeValue("gray.900", "gray.400");

	const { signOut } = useAuth();
	const router = useRouter();
	const dispatch = useDispatch();

	async function handleSignOut() {
		await signOut();
		router.reload();
	}

	function openDrawer() {
		dispatch(setMapDrawer(true));
	}

	return (
		<Box h="100vh" position="relative" overflow="hidden" color={color} bg={bg}>
			<Box h="100vh" p="20px" overflowY="scroll" overflowX="hidden">
				<VStack spacing="30px">
					<HStack justify="space-between" w="100%">
						<HStack>
							<Heading as="h1">GORUN</Heading>
						</HStack>
						<Menu placement="bottom-end">
							<MenuButton
								isRound
								as={IconButton}
								aria-label="Options"
								icon={<FaUserAlt fontSize="20px" />}
							/>
							<MenuList>
								<MenuGroup title="Theme">
									<MenuItem
										icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
										onClick={toggleColorMode}>
										{colorMode === "light" ? "Dark" : "Light"}
									</MenuItem>
								</MenuGroup>
								<MenuGroup title="User">
									<MenuItem icon={<BiArrowFromRight fontSize="20px" />} onClick={handleSignOut}>
										SIGN OUT
									</MenuItem>
								</MenuGroup>
							</MenuList>
						</Menu>
					</HStack>
					<Center>
						<IconButton
							onClick={openDrawer}
							h="200px"
							w="200px"
							isRound
							icon={<FaRunning fontSize="100px" />}
						/>
					</Center>
					<Stats />
				</VStack>
			</Box>
			<Map />
		</Box>
	);
}

export default memo(HomeRoute);
