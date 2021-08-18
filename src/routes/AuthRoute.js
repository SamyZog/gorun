import { Box, Center, Divider, Heading, HStack, Icon, SlideFade, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { GiRunningShoe } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
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
			<Center h="100vh">
				<VStack spacing="20px" maxW="600px">
					<HStack spacing="5px">
						<Heading as="h1">GORUN</Heading>
						<Icon as={GiRunningShoe} h={10} w={10} />
					</HStack>
					<Divider />
					<Text>{formType === "signin" ? "SIGN IN" : "SIGN UP"}</Text>
					<Box pb="30px">{formType === "signin" ? <SignInForm /> : <SignUpForm />}</Box>
				</VStack>
			</Center>
		</SlideFade>
	);
}
