import { Box, Center, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Map({ currentHeight, toggleHeight, correctTimeDisplay }) {
	const { distance } = useSelector((state) => state.data);

	return (
		<Box
			fontWeight="bold"
			flexDir="column"
			color="gray.900"
			w="100%"
			h={currentHeight}
			onClick={toggleHeight}
			bg="gray.50"
			transitionDuration="200ms"
			overflow="hidden">
			<Center h="10vh" fontSize="5vh">
				{correctTimeDisplay()}
			</Center>
			<Center h="10vh" fontSize="3vh">
				<Text>{distance} km</Text>
			</Center>
		</Box>
	);
}
