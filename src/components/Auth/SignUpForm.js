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
import { useRef, useState } from "react";
import { BiArrowFromBottom, BiInfoCircle, BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthProvider";
import { setEmailInputValue, setSubmitButtonState } from "../../store/auth/auth";
import { displayToast } from "../../utils/helpers";

export default function SignUpForm(props) {
	const { enterAsGuest, sendEmailLink } = useAuth();
	const inputRef = useRef();
	const router = useRouter();
	const toast = useToast();
	const [isTooltip, setIsTooltip] = useState(false);
	const { emailInputValue, submitButton } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const signUpSuccessToastId = 1;
	const singUpErrorToastId = 2;
	const signInSuccessToastId = 3;
	const signInErrorToastId = 3;

	function handleTooltipVisibility(bool) {
		setIsTooltip((state) => bool);
	}

	async function signIn() {
		try {
			await enterAsGuest();
			dispatch(setSubmitButtonState(true));
			displayToast(
				toast,
				signInSuccessToastId,
				"success",
				"Signed in as a guest, you will be redirected shortly.",
				() => {
					dispatch(setSubmitButtonState(false));
					dispatch(setEmailInputValue(""));
					router.reload();
				},
			);
		} catch ({ message }) {
			displayToast(toast, signInErrorToastId, "error", message, () => {
				inputRef.current.focus();
			});
		}
	}

	async function sendLink() {
		try {
			await sendEmailLink(emailInputValue, window.location.href);
			dispatch(setSubmitButtonState(true));
			displayToast(toast, signUpSuccessToastId, "success", `We sent a link to ${emailInputValue}.`, () => {
				dispatch(setSubmitButtonState(false));
				localStorage.setItem("gorun-email", emailInputValue);
				dispatch(setEmailInputValue(""));
				router.push("/");
			});
		} catch ({ message }) {
			displayToast(toast, singUpErrorToastId, "error", message, () => {
				inputRef.current.focus();
			});
		}
	}

	return (
		<form>
			<FormControl>
				<VStack spacing="20px">
					<InputGroup w="100%">
						<Input
							ref={inputRef}
							type="email"
							placeholder="Email"
							isRequired
							value={emailInputValue}
							onChange={(e) => dispatch(setEmailInputValue(e.target.value))}
						/>
						<InputRightAddon
							children={
								<Tooltip
									isOpen={isTooltip}
									bg="gray.900"
									shouldWrapChildren
									hasArrow
									placement="top"
									w="200px"
									label="We only need your email to sign you up, no need for passwords here!"
									aria-label="A tooltip">
									<Icon
										fontSize="25px"
										as={BiInfoCircle}
										onMouseEnter={() => handleTooltipVisibility(true)}
										onMouseLeave={() => handleTooltipVisibility(false)}
									/>
								</Tooltip>
							}
						/>
					</InputGroup>
					<Button w="100%" leftIcon={<BiArrowFromBottom />} onClick={sendLink} isDisabled={submitButton}>
						ENTER WITH EMAIL
					</Button>
					<Text>OR</Text>
					<Button w="100%" leftIcon={<BiUser />} isDisabled={submitButton} onClick={signIn}>
						ENTER AS GUEST
					</Button>
					<Text fontSize="10px" textAlign="center">
						Made by SZ &copy;
					</Text>
				</VStack>
			</FormControl>
		</form>
	);
}
