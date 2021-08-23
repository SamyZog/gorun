import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firebase } from "../firebase/firebase";
import { deleteRun, setFetchedHistory } from "../store/history/history";
import store from "../store/rootreducer";
import { displayToast } from "../utils/helpers";

const dataContext = createContext();
const { Provider: Data } = dataContext;

export default function DataProvider(props) {
	const { user } = useSelector((state) => state.auth);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const toast = useToast();

	async function deleteChosenRun(key) {
		if (user.isAnonymous) {
			dispatch(deleteRun(key));
			return;
		}
		try {
			const docRef = firebase.firestore().collection("users").doc(user.uid);
			await docRef.update({ [key]: firebase.firestore.FieldValue.delete() });
			dispatch(deleteRun(key));
		} catch ({ message }) {
			displayToast(toast, 2, "error", message);
		}
	}

	async function postRun() {
		const user = firebase.auth().currentUser;
		if (user.isAnonymous) {
			return;
		}

		const { distance, duration, startTime } = store.getState().data;
		const field = {
			[startTime]: {
				distance,
				duration,
				startTime,
			},
		};

		const docRef = firebase.firestore().collection("users").doc(user.uid);
		const doc = await docRef.get();
		if (doc.exists) {
			doc.ref.update(field);
		} else {
			doc.ref.set(field);
		}
	}

	useEffect(() => {
		if (user) {
			async function getRunHistory() {
				if (user.isAnonymous) {
					setIsLoading(false);
					return;
				}
				try {
					const docRef = firebase.firestore().collection("users").doc(user.uid);
					const doc = await docRef.get();
					dispatch(setFetchedHistory(doc.data()));
					setIsLoading(false);
				} catch ({ message }) {
					displayToast(toast, 1, "error", message);
				}
			}
			getRunHistory();
		}
	}, [user]);

	const value = {
		postRun,
		deleteChosenRun,
		isLoading,
	};

	return <Data value={value}>{props.children}</Data>;
}

export const useData = () => useContext(dataContext);
