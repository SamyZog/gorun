import { extendTheme } from "@chakra-ui/react";

export default global = extendTheme({
	initialColorMode: "dark",
	useSystemColorMode: false,
	fonts: {
		heading: "Play",
	},
	styles: {
		global: {
			body: {
				fontFamily: "Play",
				display: "flex",
				justifyContent: "center",
			},
			"#__next": {
				w: "600px",
				minW: "250px",
				minH: "100vh",
			},
			".mapboxgl-ctrl-group button": {
				display: "none",
			},
		},
	},
});
