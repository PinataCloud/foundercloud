import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
	const supabase = createClient();
	try {
		const token = request.headers.get("authorization")?.split("Bearer ")[1];
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser(token);
		if (authError) {
			console.log(authError);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
		}
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
		if (error) {
			console.log(error);
			return NextResponse.json(
				{ error: "Internal Server Error" },
				{ status: 500 },
			);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
