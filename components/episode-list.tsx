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
	userId,
}: { id: string; groupId: string; userId: string }) {
	const supabase = createClient();
	const { data: userData, error } = await supabase.auth.getUser();
	const data = await fetchData(id);
	console.log(data);
	return (
		<div className="flex flex-col gap-12 w-full">
			{data.map((item: Episode) => (
				<div key={item.id} className="flex flex-col gap-2">
					<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
						{item.name}
					</h4>
					<p>{item.description}</p>
					<audio controls src={item.audio_url} preload="metadata" playsInline>
						<source src={item.audio_url} type="audio/mpeg" />
						<source src={item.audio_url} type="audio/aac" />
						<source src={item.audio_url} type="audio/ogg" />
						<source src={item.audio_url} type="video/mp4" />
						<track kind="captions" src="" label="English" />
						Your browser does not support the audio element.
					</audio>
				</div>
			))}
			<div className="flex justify-center gap-4">
				<Button asChild>
					<Link href="/"> Go Back </Link>
				</Button>
				<CreateEpisodeForm
					id={id}
					groupId={groupId}
					isOwner={userData && userData?.user?.id === userId}
				/>
			</div>
		</div>
	);
}
