import { Box, Center, Divider, Heading, HStack, SlideFade, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignInForm from "../components/Auth/SignInForm";
import SignUpForm from "../components/Auth/SignUpForm";
import { useAuth } from "../context/AuthProvider";
import { setEmailInputValue, setFormType } from "../store/auth/auth";

export default function AuthRoute(props) {
	const { isSignInLink } = useAuth();
	const { formType } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isSignInLink(window.location.href)) {
			const email = localStorage.getItem("gorun-email");
			dispatch(setEmailInputValue(email || ""));
			dispatch(setFormType("signin"));
		} else {
			dispatch(setFormType("signup"));
		}
	}, []);

	return (
		<SlideFade in={true} direction="bottom">
			<Center h="100vh" color="var(--primary)">
				<VStack spacing="20px" maxW="600px">
					<HStack spacing="5px">
						<Heading as="h1">GORUN</Heading>
					</HStack>
					<Divider />
					<Text>{formType === "signin" ? "SIGN IN" : "SIGN UP"}</Text>
					<Box pb="30px">{formType === "signin" ? <SignInForm /> : <SignUpForm />}</Box>
				</VStack>
			</Center>
		</SlideFade>
	);
}
