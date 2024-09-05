import { supabase } from "@/lib/db";
import { CreateEpisodeForm } from "./create-episode-form";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 1;

export type Episode = {
	id: number;
	created_at: string;
	podcast: string;
	audio_url: string;
	description: string;
	name: string;
};

async function fetchData(id: string): Promise<Episode[]> {
	try {
		const { data, error } = await supabase
			.from("episodes")
			.select("*")
			.eq("podcast", id);
		return data as Episode[];
	} catch (error) {
		console.log(error);
		return [];
	}
}
export async function EpisodeList({
	id,
	groupId,
}: { id: string; groupId: string }) {
	const supabase = createClient();
	const { data: userData, error } = await supabase.auth.getUser();
	const data = await fetchData(id);
	console.log(data);
	return (
		<div className="flex flex-col gap-12">
			{data.map((item: Episode) => (
				<div key={item.id} className="flex flex-col gap-2">
					<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
						{item.name}
					</h4>
					<p>{item.description}</p>
					<audio controls src={item.audio_url}>
						<track kind="captions" src="" label="English" />
					</audio>
				</div>
			))}
			<CreateEpisodeForm
				id={id}
				groupId={groupId}
				isOwner={!!(userData && userData?.user?.id === id)}
			/>
			<div className="flex justify-center">
				<Button asChild>
					<Link href="/"> Go Back </Link>
				</Button>
			</div>
		</div>
	);
}
