import ReactQueryProvider from "@/src/providers/react-query-provider";

type ProvidersProps = {
	children: React.ReactNode;
};

export default function Providers({ children }: Readonly<ProvidersProps>) {
	return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
