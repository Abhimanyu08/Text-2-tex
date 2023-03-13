import './globals.css';

export const metadata = {
	title: 'Text-2-Tex',
	description: 'Natural Language/ Voice -> LaTeX',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link
					href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css"
					rel="stylesheet"
				/>
			</head>
			<body className="w-screen h-screen bg-black text-white">
				{children}
			</body>
		</html>
	);
}
