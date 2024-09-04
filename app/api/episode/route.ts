import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const name = formData.get("name");
		const description = formData.get("description");
		const podcastId = formData.get("podcastId");
		const audioUrl = formData.get("audio");
		const { data, error } = await supabase
			.from("episodes")
			.insert({
				name: name,
				description: description,
				audio_url: audioUrl,
				podcast: podcastId,
			})
			.select();
		console.log(data);

		return NextResponse.json(data, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
