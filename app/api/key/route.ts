import { type NextRequest, NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");
import { pinata } from "@/lib/pinata";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, res: NextResponse) {
	const supabase = createClient();
	try {
		const token = req.headers.get("authorization")?.split("Bearer ")[1];
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

		const uuid = uuidv4();
		const keyData = await pinata.keys.create({
			keyName: uuid.toString(),
			permissions: {
				endpoints: {
					pinning: {
						pinFileToIPFS: true,
					},
				},
			},
			maxUses: 1,
		});
		return NextResponse.json(keyData, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ text: "Error creating API Key:" },
			{ status: 500 },
		);
	}
}
