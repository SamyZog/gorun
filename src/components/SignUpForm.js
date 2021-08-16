/* eslint-disable react/no-children-prop */
import {
	Button,
	FormControl,
	Icon,
	Input,
	InputGroup,
	InputRightAddon,
	Text,
	Tooltip,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import { BiArrowToRight, BiInfoCircle, BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthProvider";
import { setEmailInputValue } from "../store/auth";
import { toggleDisabled, toggleEmailTooltip } from "../store/interface/interface";

export default function SignUpForm() {
	const router = useRouter();
	const isTooltipOpen = useSelector((state) => state.interface.toolTip);
	const emailValue = useSelector((state) => state.auth.email);
	const isDisabled = useSelector((state) => state.interface.disabled);
	const dispatch = useDispatch();
	const { sendEmailLink, enterAsGuest } = useAuth();
	const toast = useToast();
	const inputRef = useRef();
	const guestAuthSuccessId = "1";
	const guestAuthErrorId = "2";
	const emailAuthSuccessId = "3";
	const emailAuthErrorId = "4";

	async function signIn() {
		try {
			await enterAsGuest();
			dispatch(toggleDisabled(true));
			if (!toast.isActive(guestAuthSuccessId)) {
				toast({
					id: guestAuthSuccessId,
					position: "top",
					status: "success",
					description: "You have successfully signed in as a guest",
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						dispatch(toggleDisabled(false));
						router.push("/");
					},
				});
			}
		} catch ({ message }) {
			if (!toast.isActive(guestAuthErrorId)) {
				toast({
					id: guestAuthErrorId,
					position: "top",
					status: "error",
					description: message,
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						inputRef.current.focus();
					},
				});
			}
		}
	}

	async function sendLink() {
		try {
			await sendEmailLink(email);
			dispatch(toggleDisabled(true));
			if (!toast.isActive(emailAuthSuccessId)) {
				toast({
					id: emailAuthSuccessId,
					position: "top",
					status: "success",
					description: `We sent a link to ${emailValue}, close to continue`,
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						localStorage.setItem("runner-email", emailValue);
						dispatch(toggleDisabled(false));
						dispatch(setEmailInputValue(""));
						router.push("/");
					},
				});
			}
		} catch ({ message }) {
			if (!toast.isActive(emailAuthErrorId)) {
				toast({
					id: emailAuthErrorId,
					position: "top",
					status: "error",
					description: message,
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						inputRef.current.focus();
					},
				});
			}
		}
	}

	return (
		<FormControl as="form">
			<VStack spacing="20px">
				<InputGroup w="90%">
					<Input
						ref={inputRef}
						type="email"
						placeholder="Email"
						isRequired
						value={emailValue}
						onChange={(e) => dispatch(setEmailInputValue(e.target.value))}
					/>
					<InputRightAddon
						children={
							<Tooltip
								isOpen={isTooltipOpen}
								shouldWrapChildren
								hasArrow
								label="We only need your email to sign you up, no passwords here!"
								aria-label="A tooltip">
								<Icon
									w={6}
									h={6}
									as={BiInfoCircle}
									onMouseEnter={() => dispatch(toggleEmailTooltip(true))}
									onMouseLeave={() => dispatch(toggleEmailTooltip(false))}
								/>
							</Tooltip>
						}
					/>
				</InputGroup>
				<Button w="90%" leftIcon={<BiArrowToRight />} onClick={sendLink} isDisabled={isDisabled}>
					SIGN UP WITH EMAIL
				</Button>
				<Text>OR</Text>
				<Button w="90%" leftIcon={<BiUser />} isDisabled={isDisabled}>
					ENTER AS GUEST
				</Button>
			</VStack>
		</FormControl>
	);
}
