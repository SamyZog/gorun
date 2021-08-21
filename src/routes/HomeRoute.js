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
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { BiArrowFromRight } from "react-icons/bi";
import { FaRunning, FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Map from "../components/Run/Map";
import { useAuth } from "../context/AuthProvider";
import { setDrawerState } from "../store/map/map";

export default function HomeRoute(props) {
	const { colorMode, toggleColorMode } = useColorMode();
	const { signOut } = useAuth();
	const router = useRouter();
	const dispatch = useDispatch();

	async function handleSignOut() {
		await signOut();
		router.reload();
	}

	function openDrawer() {
		dispatch(setDrawerState(true));
	}

	return (
		<Box h="100vh" position="relative" overflow="hidden">
			<Box h="100vh" p="20px" overflowY="scroll" overflowX="hidden">
				<VStack>
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
							icon={<FaRunning fontSize="100px" />}></IconButton>
					</Center>
				</VStack>
			</Box>
			<Map />
		</Box>
	);
}
