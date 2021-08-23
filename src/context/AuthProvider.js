import { setCookie } from "nookies";
import { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebase } from "../firebase/firebase";
import { setUser } from "../store/auth/auth";

const authContext = createContext();
const { Provider: Auth } = authContext;

export default function AuthProvider(props) {
	const dispatch = useDispatch();

	async function sendEmailLink(email) {
		await firebase.auth().sendSignInLinkToEmail(email, { url: "http://localhost:3000/", handleCodeInApp: true });
	}

	function isSignInLink() {
		return firebase.auth().isSignInWithEmailLink(window.location.href);
	}

	async function signInEmailLink(email) {
		await firebase.auth().signInWithEmailLink(email, window.location.href);
	}

	async function enterAsGuest() {
		await firebase.auth().signInAnonymously();
	}

	async function signOut() {
		await firebase.auth().signOut();
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

	useEffect(() => {
		const handle = setInterval(async () => {
			const user = firebase.auth().currentUser;
			if (user) await user.getIdToken(true);
		}, 10 * 60 * 1000);

		return () => clearInterval(handle);
	}, []);

	const value = {
		sendEmailLink,
		enterAsGuest,
		signOut,
		isSignInLink,
		signInEmailLink,
	};

	return <Auth value={value}>{props.children}</Auth>;
}

export const useAuth = () => useContext(authContext);
