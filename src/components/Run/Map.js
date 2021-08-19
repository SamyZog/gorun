import { Box, Center, Icon, IconButton, ScaleFade, Text, useToast } from "@chakra-ui/react";
import useTimer from "easytimer-react-hook";
import { useRef } from "react";
import { FaRunning } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import { IoReload } from "react-icons/io5";
import { MdGpsFixed, MdGpsNotFixed, MdGpsOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerState } from "../../store/map/map";
import { checkGpsPermission } from "../../utils/helpers";
import Controls from "./Controls";
import Telemetry from "./Telemetry";

export default function Map() {
	const mapRef = useRef();
	const { isTelemetryOpen, isRunGoing, isPaused, isDrawerOpen, isGps, isGpsError } = useSelector(
		(state) => state.map,
	);
	const dispatch = useDispatch();
	const toast = useToast();
	const [timer] = useTimer();
	const [countDown] = useTimer({
		startValues: { seconds: 3 },
		target: { seconds: 0 },
		countdown: true,
	});

	function closeDrawer() {
		dispatch(setDrawerState(false));
	}

	function troubleShootGps() {
		checkGpsPermission(toast);
	}

	return (
		<Box position="absolute" top={isDrawerOpen ? "0" : "100%"} w="100%" h="100vh" transitionDuration="200ms">
			<Telemetry timer={timer} isTelemetryOpen={isTelemetryOpen} />
			<Box transitionDuration="200ms" bg="blue.900" h={isTelemetryOpen ? "80%" : "90%"} position="relative">
				<Box ref={mapRef} h="100%" />
				{!isRunGoing && (
					<Center position="absolute" w="100%" h="100%" top="0" bg="green.900" zIndex="100">
						{countDown.isRunning() ? (
							<ScaleFade in={true} key={countDown.getTimeValues().seconds}>
								<Text fontSize="10vh" color="red.200">
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
				{isPaused && (
					<Center position="absolute" top="0" left="0" bg="rgba(255,255,255,0.75)" w="100%" h="100%">
						{isGpsError && <IconButton icon={<IoReload />} onClick={troubleShootGps} />}
					</Center>
				)}
			</Box>
			<Controls countDown={countDown} timer={timer} ref={mapRef} />
			<Icon
				fontSize="20px"
				as={isGps === null ? MdGpsOff : isGps ? MdGpsFixed : MdGpsNotFixed}
				color={isGps === null ? "gray.900" : isGps ? "green.300" : "red.300"}
				position="absolute"
				left="0.75rem"
				top="0.75rem"
			/>
			<IconButton
				h="20px"
				w="20px"
				fontSize="20px"
				icon={<GoChevronDown />}
				position="absolute"
				right="0.75rem"
				top="0.75rem"
				onClick={closeDrawer}
			/>
		</Box>
	);
}
