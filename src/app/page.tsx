import Query from '@/components/Query';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="flex flex-col w-full justify-between h-screen items-center   text-white pt-6">
			<h1 className="font-bold basis-1/12 text-3xl p-2 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
				{'English → LaTeX'}
			</h1>
			<Query />
			<footer
				className="basis-1/12 w-full text-sm lg:text-md bg-gradient-to-r from-pink-500
      to-violet-600 text-center py-4
      "
			>
				<span>Made by Abhimanyu</span>
				{', '}
				<Link href="/stop" className="underline">
					Buy me a coffee
				</Link>
			</footer>
		</main>
	);
}
