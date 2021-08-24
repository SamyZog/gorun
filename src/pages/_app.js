import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import "@fontsource/play/400.css";
import { Provider as StoreProvider } from "react-redux";
import AuthProvider from "../context/AuthProvider";
import DataProvider from "../context/DataProvider";
import store from "../store/rootreducer";
import global from "../utils/chakra";

function MyApp({ Component, pageProps }) {
	return (
		<StoreProvider store={store}>
			<ChakraProvider theme={global}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<DataProvider>
					<AuthProvider>
						<Component {...pageProps} />
					</AuthProvider>
				</DataProvider>
			</ChakraProvider>
		</StoreProvider>
	);
}

export default MyApp;
