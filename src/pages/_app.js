import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/play/400.css";
import { Provider as StoreProvider } from "react-redux";
import AuthProvider from "../context/AuthProvider";
import store from "../store/rootreducer";
import global from "../utils/chakra";

function MyApp({ Component, pageProps }) {
	return (
		<StoreProvider store={store}>
			<AuthProvider>
				<ChakraProvider theme={global}>
					<Component {...pageProps} />
				</ChakraProvider>
			</AuthProvider>
		</StoreProvider>
	);
}

export default MyApp;
