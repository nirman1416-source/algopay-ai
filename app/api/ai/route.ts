export async function POST(req: Request) {
  const { prompt } = await req.json();

  return new Response(
    JSON.stringify({
      result: `✨ AI Response:\n\n"${prompt}"\n\nUnlocked via Algorand.`,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}