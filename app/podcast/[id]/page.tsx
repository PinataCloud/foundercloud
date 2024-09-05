import { EpisodeList } from "@/components/episode-list";
import { supabase } from "@/lib/db";

export type Podcast = {
	id: number;
	created_at: string;
	name: string;
	group_id: string;
	description: string;
	image_url: string;
};

async function fetchData(id: string): Promise<Podcast[]> {
	try {
		const { data, error } = await supabase
			.from("podcasts")
			.select("*")
			.eq("id", id);
		return data as Podcast[];
	} catch (error) {
		console.log(error);
		return [];
	}
}

export default async function Page({ params }: { params: { id: string } }) {
	const data = await fetchData(params.id);
	console.log(data);
	const show = data[0];
	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-24 gap-12">
			<div className="flex flex-col items-start gap-12">
				<div className="overflow-hidden" key={show.id}>
					<img
						src={show.image_url}
						className="max-h-[400px] max-w-[400px] object-cover"
						alt={show.id.toString()}
					/>
					<div className="p-2 flex flex-col gap-2">
						<h3 className="croll-m-20 text-2xl font-semibold tracking-tight">
							{show.name}
						</h3>
						<p>{show.description}</p>
					</div>
				</div>
				<EpisodeList id={params.id} groupId={show.group_id} />
			</div>
		</main>
	);
}
