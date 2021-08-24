import { Box, Center, Icon, IconButton, ScaleFade, Text, useColorModeValue } from "@chakra-ui/react";
import useTimer from "easytimer-react-hook";
import { memo, useRef } from "react";
import { FaChevronDown, FaRunning } from "react-icons/fa";
import { MdGpsFixed, MdGpsNotFixed, MdGpsOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setMapDrawer } from "../../store/map/map";
import AlertModal from "./AlertModal";
import RunControls from "./RunControls";
import Telemetry from "./Telemetry";

function Map() {
	const bg = useColorModeValue("gray.400", "gray.900");
	const color = useColorModeValue("gray.900", "gray.400");
	const mapRef = useRef();
	const dispatch = useDispatch();
	const { isDrawerOpen, isPaused, isRunInProgress, isGps, geolocate, isAlertOpen, isTelemtryOpen } = useSelector(
		(state) => state.map,
	);
	const [stopwatch] = useTimer();
	const [timer] = useTimer({
		startValues: { seconds: 4 },
		target: { seconds: 0 },
		countdown: true,
	});

	function closeDrawer() {
		dispatch(setMapDrawer(false));
	}

	return (
		<Box
			zIndex="100"
			color={color}
			bg={bg}
			userSelect="none"
			position="absolute"
			opacity={isDrawerOpen ? 1 : 0}
			top={isDrawerOpen ? 0 : "100%"}
			transitionDuration="200ms"
			h="100vh"
			w="100%">
			<IconButton icon={<FaChevronDown />} onClick={closeDrawer} position="absolute" left="1" top="1" />
			<Telemetry stopwatch={stopwatch} currentHeight={isTelemtryOpen ? "20vh" : "10vh"} />
			<Box h={isTelemtryOpen ? "80vh" : "90vh"} transitionDuration="200ms" position="relative">
				<Box ref={mapRef} h="100%" />
				{(isPaused || !isRunInProgress) && (
					<Center
						zIndex="10"
						bg={isPaused ? "rgba(0,0,0,0.75)" : bg}
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
				<RunControls stopwatch={stopwatch} timer={timer} mapContainer={mapRef.current} />
			</Box>
			{isAlertOpen && <AlertModal timer={timer} stopwatch={stopwatch} />}
		</Box>
	);
}

export default memo(Map);
