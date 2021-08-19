import { Button, Flex, forwardRef, IconButton, useToast } from "@chakra-ui/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { BsFillPauseFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { GiRunningShoe } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { setCountDownPhase, setGeoObject, setGpsError, setGpsState, setPause, setRunStart } from "../../store/map/map";
import { displayToast } from "../../utils/helpers";

const data = {
	type: "Feature",
	properties: {},
	geometry: {
		type: "LineString",
		coordinates: [],
	},
};
const layer = {
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
};

function Controls(props, ref) {
	const { countDown, timer } = props;
	const { isCountdown, isRunGoing, isPaused, isTelemetryOpen, isGpsError, geoObject } = useSelector(
		(state) => state.map,
	);
	const dispatch = useDispatch();
	const toast = useToast();

	const [runMap, setRunMap] = useState(null);

	const deniedToastId = 1;
	const promptToastId = 2;

	async function start() {
		const { state } = await navigator.permissions.query({ name: "geolocation" });
		switch (state) {
			case "denied":
				displayToast(toast, deniedToastId, "error", "GPS blocked, please enable GPS in browser settings!");
				dispatch(setGpsState(false));
				break;
			case "granted":
				dispatch(setGpsState(true));
				startSequence();
				break;
			case "prompt":
				displayToast(
					toast,
					promptToastId,
					"warning",
					"To begin your run please enable GPS in browser settings!",
				);
				dispatch(setGpsState(false));
				navigator.geolocation.getCurrentPosition(
					() => {
						dispatch(setGpsState(true));
						startSequence();
					},
					() => dispatch(setGpsState(false)),
				);
				break;
		}
	}

	function initiateMap() {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			const { longitude, latitude } = coords;
			mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
			const map = new mapboxgl.Map({
				container: ref.current,
				style: "mapbox://styles/samyzog/cks4euoh03az218kcmg5g1elw",
				center: [longitude, latitude],
				zoom: 17.5,
				attributionControl: false,
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
				map.addSource("run-path", { type: "geojson", data });
				map.addLayer(layer);
			});
			dispatch(setGeoObject(geolocate));
			setRunMap((state) => map);
		});
	}

	function startSequence() {
		initiateMap();
		countDown.start();
		dispatch(setCountDownPhase(true));
	}

	async function startTracking() {
		if (isGpsError) {
			return;
		}
		if (isCountdown) {
			dispatch(setCountDownPhase(false));
		}
		dispatch(setRunStart(true));
		timer.start();
		dispatch(setPause(false));
		geo.on("geolocate", watchSucces);
		geo.on("error", watchError);
	}

	function pauseTracking() {
		timer.pause();
		dispatch(setPause(true));
		geo.off("geolocate", watchSucces);
		geo.off("error", watchError);
	}

	function watchSucces({ coords }) {
		const { longitude, latitude } = coords;

		console.log(isTelemetryOpen);

		if (runMap.getSource("run-path")) {
			runMap.getSource("run-path").setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: [],
				},
			});
		}
	}

	function watchError({ code }) {
		pauseTracking();
		dispatch(setGpsState(false));
		dispatch(setGpsError(true));
		let message;
		switch (code) {
			case 1:
				message = "GPS is blocked!";
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
		countDown.addEventListener("targetAchieved", startTracking);
		return () => countDown.removeEventListener("targetAchieved", startTracking);
	}, [geo, runMap]);

	return (
		<Flex
			justify="space-between"
			position="absolute"
			left="50%"
			bottom="10%"
			transform="translatex(-50%)"
			zIndex="101"
			style={{ gap: "10px" }}>
			<Button onClick={() => geo.trigger()}>GEO</Button>
			{!isRunGoing && !isCountdown && (
				<IconButton
					icon={<GiRunningShoe />}
					fontSize="40px"
					borderRadius="50%"
					h="15vh"
					w="15vh"
					onClick={start}
				/>
			)}
			{isRunGoing && !isPaused && (
				<IconButton
					icon={<BsFillPauseFill />}
					fontSize="40px"
					borderRadius="50%"
					h="15vh"
					w="15vh"
					onClick={pauseTracking}
				/>
			)}
			{isPaused && (
				<>
					<IconButton
						onClick={startTracking}
						fontSize="40px"
						icon={<BsPlayFill />}
						borderRadius="50%"
						h="15vh"
						w="15vh"
					/>
					<IconButton fontSize="40px" icon={<BsStopFill />} borderRadius="50%" h="15vh" w="15vh" />
				</>
			)}
		</Flex>
	);
}

export default forwardRef(Controls);
