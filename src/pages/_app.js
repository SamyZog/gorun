import { ChakraProvider } from "@chakra-ui/react";
import { Provider as StoreProvider } from "react-redux";
import AuthProvider from "../context/AuthProvider";
import store from "../store/rootreducer";

function MyApp({ Component, pageProps }) {
	return (
		<StoreProvider store={store}>
			<AuthProvider>
				<ChakraProvider>
					<Component {...pageProps} />
				</ChakraProvider>
			</AuthProvider>
		</StoreProvider>
	);
}

export default MyApp;
