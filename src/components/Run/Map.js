import { Box, Center, Icon, IconButton, ScaleFade, Text } from "@chakra-ui/react";
import useTimer from "easytimer-react-hook";
import { useRef } from "react";
import { FaRunning } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import { MdGpsFixed, MdGpsNotFixed, MdGpsOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerState } from "../../store/map/map";
import Controls from "./Controls";
import Telemetry from "./Telemetry";

export default function Map() {
	const mapRef = useRef();
	const { isTelemetryOpen, isRunGoing, isPaused, isDrawerOpen, isGps, geoObject } = useSelector((state) => state.map);
	const dispatch = useDispatch();
	const [timer] = useTimer();
	const [countDown] = useTimer({
		startValues: { seconds: 4 },
		target: { seconds: 0 },
		countdown: true,
	});

	function closeDrawer() {
		dispatch(setDrawerState(false));
	}

	return (
		<Box position="absolute" top={isDrawerOpen ? "0" : "100%"} w="100%" h="100vh" transitionDuration="200ms">
			<Telemetry timer={timer} isTelemetryOpen={isTelemetryOpen} />
			<Box transitionDuration="200ms" h={isTelemetryOpen ? "80%" : "90%"} position="relative">
				<IconButton
					isDisabled={!isRunGoing || isPaused}
					zIndex="110"
					fontSize="20px"
					icon={isGps === null ? <MdGpsOff /> : isGps ? <MdGpsFixed /> : <MdGpsNotFixed />}
					color={isGps === null ? "gray.900" : isGps ? "green.300" : "red.300"}
					position="absolute"
					right="0.5rem"
					top="0.5rem"
					onClick={() => geoObject.trigger()}
				/>
				<Box ref={mapRef} h="100%" />
				{!isRunGoing && (
					<Center position="absolute" w="100%" h="100%" top="0" bg="gray.800" zIndex="100">
						{countDown.isRunning() ? (
							<ScaleFade in={true} key={countDown.getTimeValues().seconds}>
								<Text fontSize="10vh">
									{countDown.getTimeValues().seconds < 2
										? "GO!"
										: countDown.getTimeValues().seconds - 1}
								</Text>
							</ScaleFade>
						) : (
							<Icon fontSize="20vh" as={FaRunning} />
						)}
					</Center>
				)}
				{isPaused && <Center position="absolute" top="0" left="0" bg="rgba(0,0,0,0.75)" w="100%" h="100%" />}
			</Box>
			<Controls countDown={countDown} timer={timer} ref={mapRef} />

			<IconButton
				w="fit-content"
				h="30px"
				fontSize="30px"
				icon={<GoChevronDown />}
				position="absolute"
				right="0.5rem"
				top="1rem"
				color="gray.800"
				onClick={closeDrawer}
			/>
		</Box>
	);
}
