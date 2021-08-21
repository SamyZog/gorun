import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import global from "../utils/chakra";

export default class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head />
				<body>
					<ColorModeScript initialColorMode={global.config.initialColorMode} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
