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
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
	name: z.string().min(2),
	description: z.string().min(2),
	file: z.any(),
});

export function CreatePodcastForm() {
	const supabase = createClient();

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const fileRef = form.register("file");

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const file: File | null = values.file ? values.file[0] : null;
		const { data: userData, error } = await supabase.auth.getUser();
		if (file) {
			const data = new FormData();
			data.append("name", values.name);
			data.append("description", values.description);
			data.append("image", file);
			data.append("userId", userData.user.id);
			const createPodcastRequest = await fetch("/api/podcast", {
				method: "POST",
				body: data,
			});
			const createPodcast = await createPodcastRequest.json();
			console.log(createPodcast);
			setIsLoading(false);
			router.push(`/podcast/${createPodcast[0].id}`);
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
				<Button>Create Podcast</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Create a Podcast</DialogTitle>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Founder Mode" {...field} />
									</FormControl>
									<FormDescription>
										What's the name of your Podcast?
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
										<Input placeholder="Just go founder mode" {...field} />
									</FormControl>
									<FormDescription>What is your podcast about?</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="file"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cover Image</FormLabel>
									<FormControl>
										<Input type="file" {...fileRef} />
									</FormControl>
									<FormDescription>
										Select a cover image for your podcast
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
