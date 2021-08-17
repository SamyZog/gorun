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
import { BiArrowFromBottom, BiInfoCircle, BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthProvider";
import { setEmailInputValue } from "../store/auth";
import { toggleDisabled, toggleEmailTooltip } from "../store/interface/interface";

export default function SignUpForm(props) {
	const router = useRouter();
	const isTooltipOpen = useSelector((state) => state.interface.toolTip);
	const isDisabled = useSelector((state) => state.interface.disabled);
	const emailValue = useSelector((state) => state.auth.email);
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
					description: "Signed in as a guest, you will be redirected shortly",
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						dispatch(toggleDisabled(false));
						dispatch(setEmailInputValue(""));
						router.reload();
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
			await sendEmailLink(emailValue);
			dispatch(toggleDisabled(true));
			if (!toast.isActive(emailAuthSuccessId)) {
				toast({
					id: emailAuthSuccessId,
					position: "top",
					status: "success",
					description: `We sent a link to ${emailValue}, close this notification to continue`,
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						dispatch(toggleDisabled(false));
						localStorage.setItem("gorun-email", emailValue);
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
		<form>
			<FormControl>
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
									label="We only need your email to sign you up, no need for passwords here!"
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
					<Button w="90%" leftIcon={<BiArrowFromBottom />} onClick={sendLink} isDisabled={isDisabled}>
						ENTER WITH EMAIL
					</Button>
					<Text>OR</Text>
					<Button w="90%" leftIcon={<BiUser />} isDisabled={isDisabled} onClick={signIn}>
						ENTER AS GUEST
					</Button>
				</VStack>
			</FormControl>
		</form>
	);
}
