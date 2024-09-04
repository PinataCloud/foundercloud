"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { pinata } from "@/lib/pinata";

const formSchema = z.object({
	name: z.string().min(2),
	description: z.string().min(2),
	file: z.instanceof(FileList).optional(),
});

export function CreateEpisodeForm({
	groupId,
	id,
}: { groupId: string; id: string }) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const fileRef = form.register("file");

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const file: File | null = values.file ? values.file[0] : null;
		if (file) {
			const keyRequest = await fetch("/api/key");
			const keys = await keyRequest.json();
			const uploadFile = await pinata.upload
				.file(file)
				.key(keys.JWT)
				.group(groupId);
			const data = new FormData();
			data.append("name", values.name);
			data.append("description", values.description);
			data.append(
				"audio",
				`https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/files/${uploadFile.cid}`,
			);
			data.append("podcastId", id);
			const createEpisodeRequest = await fetch("/api/episode", {
				method: "POST",
				body: data,
			});
			const createEpisode = await createEpisodeRequest.json();
			console.log(createEpisode);
			setIsLoading(false);
		} else {
			console.log("no file selected");
			setIsLoading(false);
		}
	}

	function ButtonLoading() {
		return (
			<Button disabled>
				<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				Please wait
			</Button>
		);
	}
	return (
		<Dialog>
			<DialogTrigger>
				<Button>Add Episode</Button>
			</DialogTrigger>

			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Once upon a time" {...field} />
									</FormControl>
									<FormDescription>
										What's the title of the episode
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="On this week's episode..." {...field} />
									</FormControl>
									<FormDescription>
										What happens in this episode?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Audio</FormLabel>
									<FormControl>
										<Input type="file" {...fileRef} />
									</FormControl>
									<FormDescription>
										Select the Audio file for the Podcast
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isLoading ? (
							ButtonLoading()
						) : (
							<Button type="submit">Submit</Button>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
