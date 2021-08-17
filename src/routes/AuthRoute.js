import {
	Divider,
	Heading,
	HStack,
	Icon,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { GiRunningShoe } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useAuth } from "../context/AuthProvider";
import { setEmailInputValue, setFormType } from "../store/auth";

export default function AuthRoute(props) {
	const { isSignInLink } = useAuth();
	const formType = useSelector((state) => state.auth.formType);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isSignInLink()) {
			const email = localStorage.getItem("gorun-email");
			dispatch(setEmailInputValue(email || ""));
			dispatch(setFormType("signin"));
		} else {
			dispatch(setFormType("signup"));
		}
	}, []);

	return (
		<Modal isOpen={true} isCentered motionPreset="slideInBottom">
			<ModalOverlay />
			<ModalContent textAlign="center">
				<ModalHeader>
					<VStack spacing="20px">
						<HStack spacing="5px">
							<Icon as={GiRunningShoe} h={10} w={10} scale="-1" />
							<Heading as="h1">GORUN</Heading>
						</HStack>
						<Divider />
						<Text>{formType === "signup" ? "SIGN UP" : "SIGN IN"}</Text>
					</VStack>
				</ModalHeader>
				<ModalBody pb="30px">{formType === "signup" ? <SignUpForm /> : <SignInForm />}</ModalBody>
			</ModalContent>
		</Modal>
	);
}
