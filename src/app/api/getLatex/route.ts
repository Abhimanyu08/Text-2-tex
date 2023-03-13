import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

type ChatGPTAgent = "user" | "system";

interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

interface OpenAIStreamPayload {
    model: string;
    messages: ChatGPTMessage[];
    temperature: number;
}

export const config = {
    runtime: 'edge'
}

export async function GET(request: Request) {
    let query = (parseUrl(request.url).query.query)
    if (typeof query !== "string" || query === "") {
        return new Response(JSON.stringify({ message: "WTF" }))
    }
    query = "You are an helpful assistant whose sole job is to turn the query into Latex. Your reply should consist of just a latex equation and nothing else. Only use $ sign as the delimiter. Query: " + query

    const messages: ChatGPTMessage[] = [
        { role: "user", content: query }
    ]

    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });


    const latex = (await res.json()).choices[0].message.content


    return new Response(JSON.stringify({ latex }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'public, s-maxage=86400, stale-while-revalidate=2000',
            },
        }
    )
}

