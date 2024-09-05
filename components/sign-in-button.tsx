"use client";

import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignInButton() {
	const supabase = createClient();
	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: "https://foundercloud.vercel.app/auth/callback",
			},
		});
	}

	return <Button onClick={signInWithGithub}>Sign in</Button>;
}
