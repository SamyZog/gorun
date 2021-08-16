import React from "react";
import AuthRoute from "../routes/AuthRoute";

export default function Auth() {
	return <AuthRoute />;
}

export async function getServerSideProps() {
	return {
		props: {},
	};
}
