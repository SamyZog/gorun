import { Button, FormControl, Input, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import React, { useRef } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthProvider";
import { setEmailInputValue } from "../store/auth";
import { toggleDisabled } from "../store/interface/interface";

export default function SignInForm(props) {
	const router = useRouter();
	const emailValue = useSelector((state) => state.auth.email);
	const isDisabled = useSelector((state) => state.interface.disabled);
	const dispatch = useDispatch();
	const { signInEmailLink } = useAuth();
	const inputRef = useRef();
	const toast = useToast();
	const successSignInId = "1";
	const errorSignInId = "2";

	async function signIn() {
		try {
			await signInEmailLink(emailValue);
			dispatch(toggleDisabled(true));
			if (!toast.isActive(successSignInId)) {
				toast({
					id: successSignInId,
					position: "top",
					status: "success",
					description: "Signed in successfully, you will be redirected shortly",
					duration: 4000,
					isClosable: true,
					onCloseComplete() {
						dispatch(toggleDisabled(false));
						dispatch(setEmailInputValue(""));
						localStorage.removeItem("gorun-email");
						router.reload();
					},
				});
			}
		} catch ({ message }) {
			if (!toast.isActive(errorSignInId)) {
				toast({
					id: errorSignInId,
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
					<Input
						w="90%"
						ref={inputRef}
						type="email"
						placeholder="Email"
						isRequired
						value={emailValue}
						onChange={(e) => dispatch(setEmailInputValue(e.target.value))}
					/>
					<Button w="90%" leftIcon={<BiArrowToRight />} onClick={signIn} isDisabled={isDisabled}>
						SIGN IN
					</Button>
				</VStack>
			</FormControl>
		</form>
	);
}
