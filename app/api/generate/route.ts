import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { strength, weakness, grade } = await request.json();

  if (!strength || !weakness || !grade) {
    return Response.json({ error: "Manglende felter" }, { status: 400 });
  }

  const prompt = `Du er en lærer der designer opgaver til elever. Du skal hjælpe en elev i ${grade} der er god til ${strength} men kæmper med ${weakness}.

Din opgave er at designe ÉN opgave inden for svagheden (${weakness}) der er pakket ind i elevens styrke (${strength}), så den svage disciplin føles naturlig og interessant.

VIGTIGT – Sprogtilpasning til ${grade}:
- Brug kun ord og sætninger som en elev på det alderstrin kender og bruger i hverdagen.
- Jo yngre alderstrin, jo kortere sætninger og enklere ord. En elev i 1.-3. klasse forstår ikke lange forklaringer eller faglige termer - brug maksimalt 1-2 korte sætninger per afsnit.
- En elev i 4.-6. klasse kan klare lidt mere, men hold det stadig konkret og hverdagsnært.
- En elev i 7.-9. klasse eller gymnasium kan håndtere mere præcist fagsprog, men undgå unødigt komplicerede formuleringer.
- Tal direkte til eleven som "du", ikke i tredje person.

Svar KUN med et JSON-objekt i dette præcise format (ingen forklaring udenfor JSON):
{
  "opgave": "Opgaven formuleret i et sprog tilpasset ${grade}. Brug elevens interesse (${strength}) som den naturlige ramme for at øve ${weakness}. Kort og konkret.",
  "hjaelp": "Et første hint i samme enkle sprog som opgaven. Peg eleven i den rigtige retning uden at give svaret.",
  "mere_hjaelp": "Et mere detaljeret hint med tydelige delskridt - stadig i sprog tilpasset ${grade}."
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: "Uventet svar fra AI" }, { status: 500 });
  }

  const result = JSON.parse(jsonMatch[0]);
  return Response.json(result);
}
