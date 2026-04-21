import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { withMastra } from "@mastra/ai-sdk";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
	generateHabitTargetsSchema,
	habitTargetsSchema,
	type HabitTargets,
} from "@/lib/habit-schema";

function getGatewayConfig() {
	const baseUrl = process.env.AI_GATEWAY_BASE_URL;
	const apiKey = process.env.AI_GATEWAY_API_KEY;
	const model = process.env.AI_GATEWAY_MODEL;

	if (!baseUrl || !apiKey || !model) {
		throw new Error(
			"Missing AI gateway configuration. Set AI_GATEWAY_BASE_URL, AI_GATEWAY_API_KEY, and AI_GATEWAY_MODEL.",
		);
	}

	return {
		baseUrl: baseUrl.replace(/\/$/, ""),
		apiKey,
		model,
	};
}

function normalizeTargets(
	targets: HabitTargets,
	existingDomains: string[],
	existingExecutables: string[],
) {
	return {
		domains: Array.from(
			new Set([...existingDomains, ...targets.domains]),
		).slice(0, 20),
		executables: Array.from(
			new Set([...existingExecutables, ...targets.executables]),
		).slice(0, 20),
	};
}

function extractJsonObject(value: string) {
	console.log("Def", value);
	const normalizedValue = value
		.replace(/```json/gi, "```")
		.replace(/```/g, "")
		.trim();
	const startIndex = normalizedValue.indexOf("{");
	const endIndex = normalizedValue.lastIndexOf("}");

	if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
		return normalizedValue.slice(startIndex, endIndex + 1);
	}

	const domainsMatch = normalizedValue.match(/"domains"\s*:\s*\[[\s\S]*?\]/i);
	const executablesMatch = normalizedValue.match(
		/"executables"\s*:\s*\[[\s\S]*?\]/i,
	);

	if (domainsMatch || executablesMatch) {
		return `{${[domainsMatch?.[0], executablesMatch?.[0]].filter(Boolean).join(",")}}`;
	}

	throw new Error(
		`The AI response did not contain a valid JSON object. Raw text: ${normalizedValue}`,
	);
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
	}

	try {
		const body = await request.json();
		const parsed = generateHabitTargetsSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					message: "Validation failed.",
					errors: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		const { baseUrl, apiKey, model } = getGatewayConfig();
		const provider = createOpenAICompatible({
			name: "custom-gateway",
			apiKey,
			baseURL: baseUrl,
			includeUsage: true,
			supportsStructuredOutputs: true,
		});

		const wrappedModel = withMastra(provider.chatModel(model));
		const systemPrompt =
			"You generate tracking targets for a habit recovery app. Return only domains and executables. domains must contain hostnames or URL path patterns only. executables must contain Windows executable names ending in .exe when relevant. Keep results concise, deduplicated, and safe.";
		const userPrompt = JSON.stringify({
			task: "Generate tracking targets for a recovery habit.",
			category: parsed.data.category,
			categoryId: parsed.data.categoryId,
			prompt: parsed.data.prompt,
			existingDomains: parsed.data.existingDomains,
			existingExecutables: parsed.data.existingExecutables,
			outputRules: {
				domainsMax: 10,
				executablesMax: 10,
				preferPreciseTargets: true,
				includeExistingTargetsOnlyIfUseful: true,
			},
			outputFormat: {
				domains: ["tiktok.com", "youtube.com/shorts"],
				executables: ["Discord.exe", "Steam.exe"],
			},
		});

		const { text } = await generateText({
			model: wrappedModel,
			system: `${systemPrompt} Return strict JSON with this exact shape: {"domains": string[], "executables": string[]}. Always include both keys even when one of them is an empty array.`,
			prompt: userPrompt,
		});

		const parsedTargets = habitTargetsSchema.safeParse(
			JSON.parse(extractJsonObject(text)),
		);

		if (!parsedTargets.success) {
			return NextResponse.json(
				{
					message:
						"AI gateway returned text, but the JSON target format was invalid.",
					errors: parsedTargets.error.flatten().fieldErrors,
				},
				{ status: 502 },
			);
		}

		const generatedTargets = parsedTargets.data;

		const targets = normalizeTargets(
			generatedTargets,
			parsed.data.existingDomains,
			parsed.data.existingExecutables,
		);

		return NextResponse.json({
			message: "AI targets generated successfully.",
			targets,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message:
					error instanceof Error
						? error.message
						: "Failed to generate AI targets.",
			},
			{ status: 500 },
		);
	}
}
