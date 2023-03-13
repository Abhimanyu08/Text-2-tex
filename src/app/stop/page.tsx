import Link from "next/link";
import React from "react";

export default function Stop() {
	return (
		<div className="p-2 text-sm lg:w-1/2 tracking-wide">
			<p>
				{`Hey, Hey, Hey..... Now if you start throwing money on every
				ChatGpt wrapper out there, you'll be broke pretty soon. Just
				take the prompt below and paste it in the`}{" "}
				<a
					href="https://platform.openai.com/playground/p/default-chat"
					className="underline"
					target="_blank"
				>
					OpenAI Playground
				</a>{" "}
				and carry on converting natural language to latex. But if you
				insist, sure go ahead and{" "}
				<a
					href="https://www.buymeacoffee.com/iamabhimanm"
					className="underline"
					target={"_blank"}
				>
					feed into my caffeine addiction
				</a>
			</p>
			<div className="my-4">
				Prompt:
				<p className="select-all">
					You are an helpful assistant whose sole job is to turn the
					query into Latex. Your reply should consist of just a latex
					equation and nothing else. Only use $ sign as the delimiter.
					Query: [your query]
				</p>
			</div>
			<Link href="/" className="underline">
				Back home
			</Link>
		</div>
	);
}
