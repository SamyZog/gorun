import { Button, FormControl, Input, Text, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useRef } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthProvider";
import { setEmailInputValue, setSubmitButtonState } from "../../store/auth/auth";
import { displayToast } from "../../utils/helpers";

export default function SignInForm(props) {
	const router = useRouter();
	const inputRef = useRef();
	const toast = useToast();
	const { signInEmailLink } = useAuth();
	const { emailInputValue, submitButton } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const signInSuccessToastId = 1;
	const signInErrorToastId = 2;

	function handleInputChange(e) {
		dispatch(setEmailInputValue(e.target.value));
	}

	async function signIn() {
		try {
			await signInEmailLink(emailInputValue);
			dispatch(setSubmitButtonState(true));
			displayToast(
				toast,
				signInSuccessToastId,
				"success",
				"Signed in successfully, you will be redirected shortly.",
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

	return (
		<form>
			<FormControl>
				<VStack spacing="20px">
					<Input
						w="100%"
						ref={inputRef}
						type="email"
						placeholder="Email"
						isRequired
						value={emailInputValue}
						onChange={handleInputChange}
					/>
					<Button w="100%" leftIcon={<BiArrowToRight />} onClick={signIn} isDisabled={submitButton}>
						COMPLETE SIGN IN
					</Button>
					<Text fontSize="10px" textAlign="center">
						Made by SZ &copy;
					</Text>
				</VStack>
			</FormControl>
		</form>
	);
}
