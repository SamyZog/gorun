import { parseCookies } from "nookies";
import React from "react";
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import AuthRoute from "../routes/AuthRoute";

export default function Auth(props) {
	return <AuthRoute />;
}

export async function getServerSideProps(ctx) {
	try {
		const cookies = parseCookies(ctx);
		await firebaseAdmin.auth().verifyIdToken(cookies.fb_token);
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	} catch (error) {
		return {
			props: {},
		};
	}
}
