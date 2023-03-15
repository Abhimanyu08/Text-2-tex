"use client";

import { useRef, useState } from "react";
import {
	BsFillArrowDownCircleFill,
	BsFillArrowRightCircleFill,
	BsFillMicFill,
	BsFillStopFill,
} from "react-icons/bs";
import Latex from "react-latex";
import { createReadStream } from "fs";

function Query() {
	const [query, setQuery] = useState("");
	const [rawLatex, setRawLatex] = useState("");
	const [gettingLatex, setGettingLatex] = useState(false);
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
	const [gettingTranscription, setGettingTranscription] = useState(false);
	const chunks = useRef<Blob[]>([]);

	const sendReq = async (query: string) => {
		if (!query) {
			setRawLatex("what are you doing");
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
		// setQuery("");
	};

	const sendTranscriptionRequest = async (audio: Blob) => {
		setGettingTranscription(true);
		const res = await fetch("/api/getTranscription", {
			// headers: {
			// 	Authorization: `Bearer ${
			// 		process.env.NEXT_PUBLIC_OPENAI_KEY ?? ""
			// 	}`,
			// },
			method: "POST",
			body: audio,
		});

		try {
			if (res.status === 200) {
				const { text } = await res.json();
				setQuery(text);
			} else {
				throw Error(res.statusText);
			}
		} catch (e: any) {
			alert(e.message);
		} finally {
			setGettingTranscription(false);
		}

		// console.log(await res.json());
	};

	const startRecording = () => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				const mediaRecorder = new MediaRecorder(stream);

				mediaRecorder.ondataavailable = (e) => {
					console.log("data coming in");
					chunks.current.push(e.data);
				};

				mediaRecorder.onstop = () => {
					console.log("stopping recorder called");
					const blob = new Blob(chunks.current, {
						type: "audio/ogg; codecs=opus",
					});

					sendTranscriptionRequest(blob);
					chunks.current = [];
					setRecorder(null);
				};

				setRecorder(mediaRecorder);
				mediaRecorder.start();
			})
			.catch((e) => {
				console.error(e);
				alert(e.message);
			});
	};

	return (
		<div className="flex flex-col px-2 lg:flex-row w-full gap-3 overflow-y-auto lg:gap-0 basis-10/12  items-stretch lg:items-center lg:justify-center ">
			<div
				className="relative

				basis-3/12
			"
			>
				<textarea
					name=""
					id="query"
					value={query}
					className="bg-black  text-white border-pink-600 border-2 
				lg:h-52
				w-full
				h-full
				font-mono
                    rounded-lg p-4"
					onChange={(e) => setQuery(e.target.value)}
					placeholder={
						gettingTranscription
							? "Transcribing your audio"
							: "describe your query in natural language or record audio by clicking on the mic and press right/down arrow to generate latex (audio may not work on firefox or safari)"
					}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							sendReq(query);
						}
					}}
				/>
				<button
					className="absolute bottom-3 right-16 bg-pink-500 py-1 text-black text-sm px-2 rounded-md "
					onClick={() => {
						if (!recorder) {
							//start recording
							startRecording();
							return;
						}
						if (recorder) {
							console.log("stopping recorder");
							recorder.stop();
						}
						//stop recording

						// navigator.mediaDevices
						// 	.getUserMedia({ audio: true, video: false })
						// 	.then((stream) => {
						// 		const mediaRecorder = new MediaRecorder(stream)

						// 	});
					}}
				>
					{recorder ? (
						<BsFillStopFill size={20} className="animate-pulse" />
					) : (
						<BsFillMicFill size={20} />
					)}
				</button>
				<button
					className="absolute bottom-3 right-2  bg-pink-500 py-1 text-black text-sm px-2 rounded-md"
					onClick={() => setQuery("")}
				>
					Clear
				</button>
			</div>
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
                ${query ? "text-white scale-110 " : "text-gray-600 "}
				active:scale-90
				mx-auto
            `}
				onClick={() => {
					sendReq(query);
				}}
			>
				<BsFillArrowRightCircleFill
					className={`hidden lg:block mx-auto
				
                ${gettingLatex ? "animate-bounce" : "animate-none"}
				`}
				/>
				<BsFillArrowDownCircleFill
					className={`block lg:hidden
				
                ${gettingLatex ? "animate-bounce" : "animate-none"}
				`}
				/>
			</button>
			<div className="relative basis-3/12">
				<textarea
					name=""
					id=""
					value={rawLatex.split("\n").join(" ")}
					className="text-white bg-black 
					w-full
					h-full
					lg:h-52

				border-2 border-violet-400 p-4 rounded-md tracking-wide font-mono
                "
					onChange={(e) => setRawLatex(e.target.value)}
					placeholder="Edit the LaTeX"
				/>
				<button
					className="absolute bottom-3 right-2 bg-violet-500 py-1 text-black text-sm px-2 rounded-md"
					onClick={(e) => {
						navigator.clipboard.writeText(rawLatex);
						const elem = e.currentTarget;
						e.currentTarget.innerText = "Copied";
						setTimeout(() => {
							elem.innerText = "Copy";
							elem.style.backgroundColor = "";
						}, 3000);
					}}
				>
					Copy
				</button>
			</div>

			<button
				className="text-3xl basis-1/12
				w-fit
				mx-auto
			"
			>
				<BsFillArrowRightCircleFill className="hidden lg:block mx-auto" />
				<BsFillArrowDownCircleFill className="block lg:hidden" />
			</button>
			<div className="lg:basis-3/12 text-center my-auto font-mono">
				{rawLatex ? (
					<Latex>{rawLatex.split("\n").join(" ")}</Latex>
				) : (
					"Rendered LaTeX will be shown here"
				)}
			</div>
		</div>
	);
}

export default Query;
