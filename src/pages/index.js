import { Button } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import { useAuth } from "../context/AuthProvider";
import { firebaseAdmin } from "../firebase/firebaseAdmin";

export default function Home(props) {
	const { deleteUser, signOut } = useAuth();

	return (
		<>
			<Button>SIGN OUT</Button>
			<Button onClick={deleteUser}>DELETE</Button>
		</>
	);
}

export async function getServerSideProps(ctx) {
	try {
		const cookies = parseCookies(ctx);
		await firebaseAdmin.auth().verifyIdToken(cookies.fb_token);
		return {
			props: {},
		};
	} catch (error) {
		return {
			redirect: {
				destination: "/auth",
				permanent: false,
			},
		};
	}
}
