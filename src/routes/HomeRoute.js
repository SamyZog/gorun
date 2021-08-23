import {
	Box,
	Center,
	Divider,
	Heading,
	HStack,
	IconButton,
	List,
	ListItem,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Spinner,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { BiArrowFromRight } from "react-icons/bi";
import { FaRunning, FaUserAlt } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Map from "../components/Map/Map";
import { useAuth } from "../context/AuthProvider";
import { useData } from "../context/DataProvider";
import { setMapDrawer } from "../store/map/map";

export default function HomeRoute(props) {
	const { signOut } = useAuth();
	const { deleteChosenRun, isLoading } = useData();
	const router = useRouter();
	const dispatch = useDispatch();
	const { runs } = useSelector((state) => state.history);

	async function handleSignOut() {
		await signOut();
		router.reload();
	}

	function openDrawer() {
		dispatch(setMapDrawer(true));
	}

	return (
		<Box h="100vh" position="relative" overflow="hidden">
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
					<Box
						w="100%"
						bg="gray.50"
						overflow="hidden"
						p="10px 0 0 10px"
						pb="0"
						color="gray.800"
						borderRadius="5px">
						<Heading mb="5">History</Heading>
						<Box h="50vh" overflowY="scroll">
							{isLoading && (
								<Center h="full">
									<Spinner />
								</Center>
							)}
							{!isLoading && !Object.keys(runs).length && (
								<Center h="full">
									<Text>No run history yet</Text>
								</Center>
							)}
							{!isLoading && Object.keys(runs).length > 0 && (
								<List spacing={3}>
									{Object.keys(runs)
										.sort((a, b) => b - a)
										.map((el) => {
											const { distance, duration } = runs[el];
											return (
												<ListItem key={el} position="relative">
													<IconButton
														icon={<RiDeleteBin6Line />}
														position="absolute"
														right="0"
														top="0"
														color="red.400"
														onClick={() => deleteChosenRun(el)}
													/>
													<Text>{new Date(+el).toLocaleString()}</Text>
													<HStack>
														<Stat>
															<StatLabel>Distance</StatLabel>
															<StatNumber>{distance}</StatNumber>
															<StatHelpText>km</StatHelpText>
														</Stat>
														<Stat>
															<StatLabel>Duration</StatLabel>
															<StatNumber>{duration}</StatNumber>
															<StatHelpText>hh:mm:ss</StatHelpText>
														</Stat>
													</HStack>
													<Divider bg="gray.800" />
												</ListItem>
											);
										})}
								</List>
							)}
						</Box>
					</Box>
				</VStack>
			</Box>
			<Map />
		</Box>
	);
}
