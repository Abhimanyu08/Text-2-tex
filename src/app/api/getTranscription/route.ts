// import FormData from "form-data";
export async function POST(req: Request) {



    const audio = await req.blob()
    const formData = new FormData()

    formData.append("file", audio, "audio.wav")
    formData.append("model", "whisper-1")

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY ?? ""}`,
        },
        method: "POST",
        body: formData,
    })

    try {

        const { text } = await res.json()
        return new Response(JSON.stringify(
            {
                text
            }
        ),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }
        )
    } catch (e: any) {
        return new Response(
            JSON.stringify({
                error: e.message
            }),
            {
                status: 501,
                statusText: e.message
            }
        )
    }


    // const { text } = await res.json()
    // console.log(text)
}