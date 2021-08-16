import { setCookie } from "nookies";
import { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebase } from "../firebase/firebase";
import { setUser } from "../store/auth";

const authContext = createContext();
const { Provider: Auth } = authContext;

export default function AuthProvider(props) {
	const dispatch = useDispatch();

	async function sendEmailLink(email) {
		await firebase.auth().sendSignInLinkToEmail(email, { url: "http://localhost:3000/", handleCodeInApp: true });
	}

	async function enterAsGuest() {
		await firebase.auth().signInAnonymously();
	}

	useEffect(() => {
		const unsubscribe = firebase.auth().onIdTokenChanged(async (user) => {
			if (user) {
				dispatch(setUser(user));
				const token = await user.getIdToken();
				setCookie(null, "fb_token", token, { path: "/" });
			} else {
				dispatch(setUser(null));
				setCookie(null, "fb_token", "", { path: "/" });
			}
		});
		return unsubscribe;
	}, []);

	const value = {
		sendEmailLink,
		enterAsGuest,
	};

	return <Auth value={value}>{props.children}</Auth>;
}

export const useAuth = () => useContext(authContext);
