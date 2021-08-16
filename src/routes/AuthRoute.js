import {
	Center,
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
import { GiRunningShoe } from "react-icons/gi";
import SignUpForm from "../components/SignUpForm";

export default function AuthRoute(props) {
	return (
		<Center>
			<Modal isOpen={true} isCentered motionPreset="slideInBottom">
				<ModalOverlay />
				<ModalContent textAlign="center">
					<ModalHeader>
						<VStack spacing="20px">
							<HStack>
								<Heading as="h1">RUNNER</Heading>
								<Icon as={GiRunningShoe} h={10} w={10} />
							</HStack>
							<Divider />
							<Text>SIGN UP</Text>
						</VStack>
					</ModalHeader>
					<ModalBody pb="30px">
						<SignUpForm />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Center>
	);
}
