import { Button, Flex, forwardRef, IconButton, useToast } from "@chakra-ui/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { BsFillPauseFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
	setCountDownPhase,
	setGeoObject,
	setGpsError,
	setGpsState,
	setPause,
	setRunStart,
	setTelemetry,
} from "../../store/map/map";
import { displayToast } from "../../utils/helpers";

function Controls(props, ref) {
	const { countDown, timer } = props;
	const {
		isCountdown,
		isRunGoing,
		isPaused,
		isGpsError,
		telemetry: { geoStamps },
	} = useSelector((state) => state.map);
	const [runMap, setRunMap] = useState(null);
	const dispatch = useDispatch();
	const toast = useToast();
	const watchRef = useRef();
	const isRunGoingRef = useRef(isRunGoing);

	function initiateMap(coords) {
		const { longitude, latitude } = coords;
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
		const map = new mapboxgl.Map({
			container: ref.current,
			style: "mapbox://styles/samyzog/cks4euoh03az218kcmg5g1elw",
			center: [longitude, latitude],
			zoom: 17.5,
			attributionControl: false,
			locale: "en",
		});
		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			fitBoundsOptions: { maxZoom: 17.5 },
			trackUserLocation: true,
			showUserHeading: true,
			showAccuracyCircle: false,
		});

		map.addControl(geolocate);
		map.on("load", () => {
			geolocate.trigger();
			map.addSource("run-path", {
				type: "geojson",
				data: {
					type: "Feature",
					properties: {},
					geometry: {
						type: "LineString",
						coordinates: [],
					},
				},
			});
			map.addLayer({
				id: "run-path",
				type: "line",
				source: "run-path",
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": "#03c4a1",
					"line-width": 4,
				},
			});
		});
		dispatch(setGeoObject(geolocate));
		setRunMap(map);
	}

	function runStart() {
		dispatch(setPause(false));
		if (isRunGoingRef.current) {
			timer.start();
		}
		navigator.geolocation.clearWatch(watchRef.current);
		watchRef.current = navigator.geolocation.watchPosition(success, error);
	}

	function runPause() {
		timer.pause();
		dispatch(setPause(true));
		navigator.geolocation.clearWatch(watchRef.current);
	}

	function runStop() {}

	function success({ coords }) {
		dispatch(setGpsState(true));
		dispatch(setGpsError(false));
		if (!isRunGoingRef.current) {
			initiateMap(coords);
			countDown.start();
			dispatch(setCountDownPhase(true));
			return;
		}
		const { longitude, latitude } = coords;
		dispatch(setTelemetry(["geoStamps", { coords: [longitude, latitude], time: Date.now() }]));
	}

	function error({ code }) {
		dispatch(setGpsState(false));
		dispatch(setGpsError(true));
		runPause();
		let message;
		switch (code) {
			case 1:
				message = "GPS is disabled! Enable in browser settings";
				break;
			case 2:
				message = "Cannot locate device!";
				break;
			case 3:
				message = "No connection to GPS!";
				break;
		}
		displayToast(toast, 3, "error", message);
	}

	useEffect(() => {
		if (geoStamps.length >= 2) {
			runMap.getSource("run-path").setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: geoStamps.map(({ coords }) => coords),
				},
			});
		}
	}, [geoStamps]);

	function countDownTargetAchieved() {
		dispatch(setRunStart(true));
		dispatch(setCountDownPhase(false));
		runStart();
	}

	useEffect(() => {
		isRunGoingRef.current = isRunGoing;
		countDown.on("targetAchieved", countDownTargetAchieved);
		return () => {
			countDown.removeAllEventListeners();
		};
	}, [isRunGoing]);

	return (
		<Flex
			justify="space-between"
			position="absolute"
			left="50%"
			bottom="10%"
			transform="translatex(-50%)"
			zIndex="101"
			style={{ gap: "15px" }}>
			{!isCountdown && !isRunGoing && !isGpsError && (
				<Button fontSize="40px" borderRadius="50%" h="15vh" w="15vh" onClick={runStart}>
					GO
				</Button>
			)}

			{!isPaused && isRunGoing && (
				<IconButton
					icon={<BsFillPauseFill />}
					fontSize="40px"
					borderRadius="50%"
					h="15vh"
					w="15vh"
					onClick={runPause}
				/>
			)}

			{isPaused && !isGpsError && (
				<IconButton
					onClick={runStart}
					fontSize="40px"
					icon={<BsPlayFill />}
					borderRadius="50%"
					h="15vh"
					w="15vh"
				/>
			)}

			{isGpsError && (
				<IconButton
					fontSize="40px"
					icon={<AiOutlineReload />}
					borderRadius="50%"
					h="15vh"
					w="15vh"
					onClick={runStart}
				/>
			)}

			{(isPaused || isGpsError) && (
				<IconButton
					fontSize="40px"
					icon={<BsStopFill />}
					borderRadius="50%"
					h="15vh"
					w="15vh"
					onClick={runStop}
				/>
			)}
		</Flex>
	);
}

export default forwardRef(Controls);
