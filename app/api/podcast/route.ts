import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { supabase } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const name = formData.get("name");
		const description = formData.get("description");
		const userId = formData.get("userId");
		const file: File | null = formData.get("image") as unknown as File;
		const group = await pinata.groups.create({
			name: name as string,
			isPublic: true,
		});
		const { cid } = await pinata.upload.file(file).group(group.id);
		const imageUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${cid}`;
		const { data, error } = await supabase
			.from("podcasts")
			.insert({
				name: name,
				group_id: group.id,
				description: description,
				image_url: imageUrl,
				user_id: userId,
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
