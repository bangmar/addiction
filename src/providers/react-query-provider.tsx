"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

type ReactQueryProviderProps = {
	children: React.ReactNode;
};

export default function ReactQueryProvider({
	children,
}: Readonly<ReactQueryProviderProps>) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
