import { Button, HStack, IconButton, useToast } from "@chakra-ui/react";
import { lineString } from "@turf/helpers";
import length from "@turf/length";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { BsPauseFill, BsPlayFill, BsStopFill } from "react-icons/bs";
import { TiRefresh } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setCoords, setDistance, setDuration, setStartTime } from "../../store/data/data";
import { setAlertState, setGeolocate, setGps, setMap, setPause, setRunState } from "../../store/map/map";
import { displayToast } from "../../utils/helpers";

export default function RunControls({ stopwatch, timer, mapContainerRef, correctTimeDisplay }) {
	const { isGps, map, isRunInProgress, isPaused, geolocate } = useSelector((state) => state.map);
	const { coords } = useSelector((state) => state.data);
	const dispatch = useDispatch();
	const toast = useToast();
	const watchRef = useRef();
	const runRef = useRef(isRunInProgress);

	function initiateMap(longitude, latitude) {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/samyzog/cks4euoh03az218kcmg5g1elw",
			center: [longitude, latitude],
			zoom: 17.5,
			attributionControl: false,
			locale: "en-EN",
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
		map.addControl(geolocate).on("load", () => {
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
			}).addLayer({
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
		dispatch(setMap(map));
		dispatch(setGeolocate(geolocate));
	}

	function start() {
		runRef.current && stopwatch.start();
		dispatch(setPause(false));
		navigator.geolocation.clearWatch(watchRef.current);
		watchRef.current = navigator.geolocation.watchPosition(success, error);
	}

	function timerTargetAchieved() {
		dispatch(setStartTime(Date.now()));
		stopwatch.start();
		dispatch(setRunState(true));
		start();
	}

	function pause() {
		stopwatch.pause();
		dispatch(setPause(true));
		navigator.geolocation.clearWatch(watchRef.current);
	}

	function resume() {
		start();
	}

	function stop() {
		dispatch(setDuration(correctTimeDisplay()));
		dispatch(setAlertState(true));
	}

	function success({ coords }) {
		console.log(runRef.current);
		if (isGps === "error") {
			if (runRef.current) {
				geolocate.trigger();
			}
			dispatch(setGps(true));
		}
		const { longitude, latitude } = coords;
		if (!runRef.current) {
			dispatch(setGps(true));
			initiateMap(longitude, latitude);
			timer.start();
			return;
		}
		console.log("zabre");
		dispatch(setCoords([longitude, latitude]));
	}

	function error({ code }) {
		dispatch(setGps("error"));
		pause();
		let message;
		switch (code) {
			case 1:
				message = "GPS is blocked, unblock GPS in browser settings to continue";
				break;
			case 2:
			case 3:
				message = "No connection to GPS!";
				break;
		}
		displayToast(toast, 1, "error", message);
	}

	useEffect(() => {
		if (coords.length >= 2) {
			const distance = length(lineString(coords));
			dispatch(setDistance(distance.toFixed(2)));
			map.getSource("run-path").setData({
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: coords,
				},
			});
		}
	}, [coords]);

	useEffect(() => {
		runRef.current = isRunInProgress;

		timer.on("targetAchieved", timerTargetAchieved);

		return () => {
			timer.removeAllEventListeners();
		};
	}, [isRunInProgress]);

	return (
		<HStack zIndex="10" position="absolute" bottom="5vh" left="50%" transform="translateX(-50%)">
			{isGps !== "error" && (
				<>
					{!isRunInProgress && !timer.isRunning() && (
						<Button fontSize="5vh" borderRadius="full" h="15vh" w="15vh" onClick={start}>
							GO
						</Button>
					)}
					{!isPaused && isRunInProgress && (
						<IconButton
							fontSize="5vh"
							borderRadius="full"
							h="15vh"
							w="15vh"
							icon={<BsPauseFill />}
							onClick={pause}
						/>
					)}
					{isPaused && (
						<IconButton
							fontSize="5vh"
							borderRadius="full"
							h="15vh"
							w="15vh"
							icon={<BsPlayFill />}
							onClick={resume}
						/>
					)}
				</>
			)}
			{(isPaused || isGps === "error") && (
				<IconButton fontSize="5vh" borderRadius="full" h="15vh" w="15vh" icon={<BsStopFill />} onClick={stop} />
			)}
			{isGps === "error" && (
				<IconButton fontSize="5vh" borderRadius="full" h="15vh" w="15vh" icon={<TiRefresh />} onClick={start} />
			)}
		</HStack>
	);
}
