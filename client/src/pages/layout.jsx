import React from "react";
import Header from "../components/header";

export default function Layout({ children }) {
	return (
		<div className="min-h-screen bg-gray-100">
			<Header />
			<main className="container">{children}</main>
		</div>
	);
}
