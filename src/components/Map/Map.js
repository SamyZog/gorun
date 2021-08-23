import { Box, Center, Icon, IconButton, ScaleFade, Text } from "@chakra-ui/react";
import useTimer from "easytimer-react-hook";
import { useRef, useState } from "react";
import { FaChevronDown, FaRunning } from "react-icons/fa";
import { MdGpsFixed, MdGpsNotFixed, MdGpsOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setMapDrawer } from "../../store/map/map";
import AlertModal from "./AlertModal";
import RunControls from "./RunControls";
import Telemetry from "./Telemetry";

export default function Map() {
	const mapRef = useRef();
	const dispatch = useDispatch();
	const { isDrawerOpen, isPaused, isRunInProgress, isGps, geolocate } = useSelector((state) => state.map);
	const [isFullTelemtry, setIsFullTelemetry] = useState(false);
	const [stopwatch] = useTimer();
	const [timer] = useTimer({
		startValues: { seconds: 3 },
		target: { seconds: 0 },
		countdown: true,
	});

	function correctTimeDisplay() {
		let { hours, minutes, seconds } = stopwatch.getTimeValues();
		hours = hours < 10 ? `0${hours}` : hours;
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		return `${hours}:${minutes}:${seconds}`;
	}

	function closeDrawer() {
		dispatch(setMapDrawer(false));
	}

	function toggleTelemetryHeight() {
		if (!stopwatch.isRunning()) return;
		setIsFullTelemetry(!isFullTelemtry);
	}

	return (
		<Box
			userSelect="none"
			position="absolute"
			opacity={isDrawerOpen ? 1 : 0}
			top={isDrawerOpen ? 0 : "100%"}
			transitionDuration="200ms"
			h="100vh"
			w="100%">
			<IconButton
				icon={<FaChevronDown />}
				onClick={closeDrawer}
				position="absolute"
				left="1"
				top="1"
				color="gray.900"
			/>
			<Telemetry
				correctTimeDisplay={correctTimeDisplay}
				stopwatch={stopwatch}
				currentHeight={isFullTelemtry ? "20vh" : "10vh"}
				toggleHeight={toggleTelemetryHeight}
			/>
			<Box h={isFullTelemtry ? "80vh" : "90vh"} transitionDuration="200ms" position="relative">
				<Box ref={mapRef} h="100%" />
				{(isPaused || !isRunInProgress) && (
					<Center
						zIndex="10"
						bg={isPaused ? "rgba(0,0,0,0.75)" : "gray.800"}
						position="absolute"
						h="100%"
						w="100%"
						top="0"
						left="0">
						{timer.isRunning() ? (
							<ScaleFade in={true} key={timer.getTimeValues().seconds}>
								<Text fontSize="20vh">{timer.getTimeValues().seconds}</Text>
							</ScaleFade>
						) : (
							<Icon as={FaRunning} fontSize="20vh" />
						)}
					</Center>
				)}
				<IconButton
					zIndex="8"
					onClick={() => geolocate.trigger()}
					position="absolute"
					fontSize="150%"
					right="1.5"
					top="1.5"
					color={isGps === false ? "gray.800" : isGps === "error" ? "red.400" : "green.400"}
					icon={isGps === false ? <MdGpsNotFixed /> : isGps === "error" ? <MdGpsOff /> : <MdGpsFixed />}
				/>
				<RunControls
					correctTimeDisplay={correctTimeDisplay}
					stopwatch={stopwatch}
					timer={timer}
					mapContainerRef={mapRef}
				/>
			</Box>
			<AlertModal timer={timer} stopwatch={stopwatch} />
		</Box>
	);
}
