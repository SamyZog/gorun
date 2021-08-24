import { Box, Center, Divider, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTelemetryState } from "../../store/map/map";

function Telemetry({ currentHeight, stopwatch }) {
	const { distance } = useSelector((state) => state.data);
	const [time, setTime] = useState("00:00:00");

	const { isRunInProgress, isTelemtryOpen } = useSelector((state) => state.map);
	const dispatch = useDispatch();

	function toggleTelemetryHeight() {
		if (!isRunInProgress) return;
		dispatch(setTelemetryState(!isTelemtryOpen));
	}

	useEffect(() => {
		let { hours, minutes, seconds } = stopwatch.getTimeValues();
		hours = hours < 10 ? `0${hours}` : hours;
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		setTime(`${hours}:${minutes}:${seconds}`);
	}, [stopwatch.getTimeValues().seconds]);

	return (
		<Box
			fontWeight="bold"
			flexDir="column"
			w="100%"
			h={currentHeight}
			onClick={toggleTelemetryHeight}
			transitionDuration="200ms"
			overflow="hidden">
			<Center h="10vh" fontSize="5vh">
				{time}
			</Center>
			<Divider />
			<Center h="10vh" fontSize="3vh">
				<Text>{distance} km</Text>
			</Center>
		</Box>
	);
}

export default Telemetry;
