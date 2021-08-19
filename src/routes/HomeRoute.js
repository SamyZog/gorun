import {
	Box,
	Center,
	Container,
	Heading,
	HStack,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { BiArrowFromRight } from "react-icons/bi";
import { FaRunning, FaUserAlt } from "react-icons/fa";
import { GiRunningShoe } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import Map from "../components/Run/Map";
import { useAuth } from "../context/AuthProvider";
import { setDrawerState } from "../store/map/map";

export default function HomeRoute(props) {
	const { signOut } = useAuth();
	const router = useRouter();
	const { isDrawerOpen } = useSelector((state) => state.map);
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
			<Container h="100vh" color="blue.900" p="20px" bg="pink.500" overflowY="scroll">
				<VStack spacing="50px">
					<HStack justify="space-between" w="100%">
						<HStack>
							<Heading as="h1">GORUN</Heading>
							<Icon as={GiRunningShoe} fontSize="30px" />
						</HStack>
						<Menu placement="bottom-end">
							<MenuButton
								isRound
								boxShadow="lg"
								as={IconButton}
								aria-label="Options"
								color="blue.900"
								icon={<FaUserAlt fontSize="20px" />}
							/>
							<MenuList color="blue.900">
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
							boxShadow="lg"
							h="200px"
							w="200px"
							isRound
							color="blue.900"
							icon={<FaRunning fontSize="100px" />}></IconButton>
					</Center>
					<Box bg="gray.50" color="blue.900" h="200px" w="100%" borderRadius="5px" boxShadow="lg">
						<Center>
							<Heading>HISTORY</Heading>
						</Center>
					</Box>
					<Box bg="gray.50" color="blue.900" h="200px" w="100%" borderRadius="5px" boxShadow="lg">
						<Center>
							<Heading>RECORDS</Heading>
						</Center>
					</Box>
				</VStack>
			</Container>
			<Map />
		</Box>
	);
}
