import { extendTheme } from "@chakra-ui/react";

export default global = extendTheme({
	styles: {
		global: {
			body: {
				display: "flex",
				justifyContent: "center",
			},
			"#__next": {
				w: "600px",
				minW: "250px",
				minH: "100vh",
			},
			".mapbox-ctrl-top-right button": {
				display: "none",
			},
		},
	},
});
