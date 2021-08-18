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
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthProvider";

export default function HomeRoute(props) {
	const { signOut } = useAuth();
	const router = useRouter();
	const dispatch = useDispatch();

	async function handleSignOut() {
		await signOut();
		router.reload();
	}

	return (
		<Container minH="100vh" bg="blue.900" color="blue.50" p="20px">
			<VStack spacing="50px">
				<HStack justify="space-between" w="100%">
					<HStack>
						<Heading as="h1" size="lg">
							GORUN
						</Heading>
						<Icon as={GiRunningShoe} h={10} w={10} scale="-1" />
					</HStack>
					<Menu placement="bottom-end">
						<MenuButton
							isRound
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
						onClick={openMap}
						h="200px"
						w="200px"
						isRound
						color="blue.900"
						icon={<FaRunning fontSize="100px" />}></IconButton>
				</Center>
				<Box bg="gray.50" color="blue.900" h="200px" w="100%" borderRadius="5px">
					<Center>
						<Heading>HISTORY</Heading>
					</Center>
				</Box>
				<Box bg="gray.50" color="blue.900" h="200px" w="100%" borderRadius="5px">
					<Center>
						<Heading>RECORDS</Heading>
					</Center>
				</Box>
			</VStack>
		</Container>
	);
}
