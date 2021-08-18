import { parseCookies } from "nookies";
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import HomeRoute from "../routes/HomeRoute";

export default function Home(props) {
	return <HomeRoute />;
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
