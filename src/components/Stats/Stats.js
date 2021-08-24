import {
	Box,
	Center,
	Divider,
	Heading,
	HStack,
	IconButton,
	List,
	ListItem,
	Spinner,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useData } from "../../context/DataProvider";

export default function Stats(props) {
	const bg = useColorModeValue("gray.400", "gray.900");
	const color = useColorModeValue("gray.900", "gray.400");
	const { runs } = useSelector((state) => state.history);
	const { deleteChosenRun, isLoading } = useData();

	return (
		<Box w="100%" overflow="hidden" p="10px 0 0 10px" pb="0" borderRadius="5px" bg={color} color={bg}>
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
					<List spacing="10px">
						{Object.keys(runs)
							.sort((a, b) => b - a)
							.map((el) => {
								const { distance, duration } = runs[el];
								return (
									<Fragment key={el}>
										<Divider bg={bg} />
										<ListItem position="relative">
											<IconButton
												zIndex="5"
												icon={<RiDeleteBin6Line />}
												position="absolute"
												right="10px"
												top="10px"
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
										</ListItem>
									</Fragment>
								);
							})}
					</List>
				)}
			</Box>
		</Box>
	);
}
