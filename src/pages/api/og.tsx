import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
    runtime: "edge",
};
// eslint-disable-next-line @typescript-eslint/require-await

export default function handler(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const hasTitle = searchParams.has("title");
        const title = hasTitle
            ? searchParams.get("title")?.slice(0, 100)
            : null;

        const hasContent = searchParams.has("content");
        const content = hasContent
            ? searchParams.get("content")?.slice(0, 100)
            : null;

        const hasDate = searchParams.has("date");
        const date = hasDate ? searchParams.get("date")?.slice(0, 100) : null;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call

        return new ImageResponse(
            (
                <div tw="w-full h-full bg-white flex flex-col justify-between text-[30px] p-5">
                    <p>
                        <span className="text-bold">Title:</span>
                        {title || ""}
                    </p>
                    <p>
                        <span className="font-semibold">Content:</span>I am fine
                        {content || ""}
                    </p>
                    <p>
                        Created on:<code>{date || ""}</code>
                    </p>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.log(e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
