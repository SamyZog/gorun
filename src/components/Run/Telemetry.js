import { Box, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTelemetryHeight } from "../../store/map/map";

export default function Telemetry(props) {
	const { timer, isTelemetryOpen } = props;
	const { isGps, isRunGoing } = useSelector((state) => state.map);
	const dispatch = useDispatch();
	let { hours, minutes, seconds } = timer.getTimeValues();
	hours = hours < 10 ? `0${hours}` : hours;
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	seconds = seconds < 10 ? `0${seconds}` : seconds;

	function toggleTelemetry() {
		isRunGoing && dispatch(toggleTelemetryHeight());
	}

	return (
		<Box
			bg="green.50"
			fontWeight="bold"
			fontSize="4vh"
			onClick={toggleTelemetry}
			h={isTelemetryOpen ? "20%" : "10%"}
			overflow="hidden"
			transitionDuration="200ms">
			<Flex h="10vh" justify="center" alignItems="center">
				<Text fontSize={isTelemetryOpen || "6vh"} transitionDuration="200ms">
					{hours}:{minutes}:{seconds}
				</Text>
			</Flex>
			<Divider />
			<Flex
				h="10vh"
				justify="space-around"
				alignItems="center"
				opacity={isTelemetryOpen ? 1 : 0}
				transitionDuration="200ms">
				<HStack>
					<Text>0.0</Text>
					<Text fontSize="0.5em">km</Text>
				</HStack>
				<HStack>
					<Text>0.00</Text>
					<Text fontSize="0.5em">km/h</Text>
				</HStack>
			</Flex>
		</Box>
	);
}
