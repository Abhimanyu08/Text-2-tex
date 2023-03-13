'use client';

import { useState } from 'react';
import Latex from 'react-latex';
import {
	BsFillArrowRightCircleFill,
	BsFillArrowDownCircleFill,
} from 'react-icons/bs';

function Query() {
	const [query, setQuery] = useState('');
	const [rawLatex, setRawLatex] = useState('');
	const [gettingLatex, setGettingLatex] = useState(false);

	const sendReq = async (query: string) => {
		if (!query) {
			setRawLatex('what are you doing');
			return;
		}
		setGettingLatex(true);
		const resp = await fetch(
			`/api/getLatex?query=${encodeURIComponent(query)}`
		);
		// console.log(resp.body);
		const { latex } = await resp.json();
		setRawLatex(latex);
		setGettingLatex(false);
	};

	return (
		<div className="flex flex-col px-2 lg:flex-row w-full gap-3 overflow-y-auto lg:gap-0 basis-10/12  items-stretch lg:items-center lg:justify-center ">
			<textarea
				name=""
				id="query"
				value={query}
				className="bg-black  text-white border-pink-600 border-2 
				basis-3/12
				lg:h-52
				font-mono
                    rounded-lg p-4"
				onChange={(e) => setQuery(e.target.value)}
				placeholder="describe your query in natural language and press right/down arrow to generate latex"
			/>
			{/* <button
					onClick={() => sendReq(query)}
					className="text-black p-2 rounded-md bg-cyan-400 px-4"
				>
					Send
				</button> */}

			<button
				className={`
                text-3xl
				basis-1/12
				w-fit
				justify-self-center
				
transition
                ${query ? 'text-white scale-110 ' : 'text-gray-600 '}
				active:scale-90
				mx-auto
            `}
				onClick={() => sendReq(query)}
			>
				<BsFillArrowRightCircleFill
					className={`hidden lg:block mx-auto
				
                ${gettingLatex ? 'animate-bounce' : 'animate-none'}
				`}
				/>
				<BsFillArrowDownCircleFill
					className={`block lg:hidden
				
                ${gettingLatex ? 'animate-bounce' : 'animate-none'}
				`}
				/>
			</button>
			<textarea
				name=""
				id=""
				value={rawLatex.split('\n').join(' ')}
				className="text-white bg-black basis-3/12 

				lg:h-52
				border-2 border-violet-400 p-4 rounded-md tracking-wide font-mono
                "
				onChange={(e) => setRawLatex(e.target.value)}
				placeholder="Edit the LaTeX"
			/>

			<button
				className="text-3xl basis-1/12
				w-fit
				mx-auto
			"
			>
				<BsFillArrowRightCircleFill className="hidden lg:block mx-auto" />
				<BsFillArrowDownCircleFill x-auto className="block lg:hidden" />
			</button>
			<div className="lg:basis-3/12 text-center my-auto font-mono">
				{rawLatex ? (
					<Latex>{rawLatex.split('\n').join(' ')}</Latex>
				) : (
					'Rendered LaTeX will be shown here'
				)}
			</div>
		</div>
	);
}

export default Query;
