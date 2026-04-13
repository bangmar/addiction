import ReactQueryProvider from "@/src/providers/react-query-provider";
import AppSessionProvider from "@/src/providers/session-provider";

type ProvidersProps = {
	children: React.ReactNode;
};

export default function Providers({ children }: Readonly<ProvidersProps>) {
	return (
		<AppSessionProvider>
			<ReactQueryProvider>{children}</ReactQueryProvider>
		</AppSessionProvider>
	);
}
