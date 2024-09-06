import { CreatePodcastForm } from "@/components/create-podcast-form";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";

export const revalidate = 60;

export type Podcast = {
	id: number;
	created_at: string;
	name: string;
	group_id: string;
	description: string;
	image_url: string;
};

async function fetchData(): Promise<Podcast[]> {
	try {
		const supabase = createClient();
		const { data, error } = await supabase.from("podcasts").select("*");
		return data as Podcast[];
	} catch (error) {
		console.log(error);
		return [];
	}
}

export default async function Home() {
	const data = await fetchData();
	const supabase = createClient();
	const { data: userData, error } = await supabase.auth.getUser();

	console.log(data);

	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-24 gap-12">
			<div className="flex flex-col gap-2 text-center">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					FounderCloud
				</h1>
				<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
					Yap like your SaaS depended on it
				</h4>
			</div>
			{data.map((item: Podcast) => (
				<Card className="overflow-hidden max-w-[400px]" key={item.id}>
					<Link href={`/podcast/${item.id}`}>
						<img
							src={item.image_url}
							className="sm:max-h-[400px] sm:max-w-[400px] max-h-[300px] max-w-[300px] object-cover"
							alt={item.id.toString()}
						/>
						<div className="p-2 flex flex-col gap-2">
							<h3 className="croll-m-20 text-2xl font-semibold tracking-tight">
								{item.name}
							</h3>
							<p>{item.description}</p>
						</div>
					</Link>
				</Card>
			))}
			{error || !userData.user ? <SignInButton /> : <CreatePodcastForm />}
		</main>
	);
}
