import { Draw, Ticket, MAIN_COUNT } from "./types";

export type MatchResult = {
  matched: number[];
  matchedCount: number;
  bonusMatched: boolean;
  tier: string;
};

export function checkTicket(ticket: Ticket, draw: Draw): MatchResult {
  const drawSet = new Set(draw.numbers);
  const matched = ticket.numbers.filter((n) => drawSet.has(n));
  const bonusMatched =
    draw.bonus != null && ticket.numbers.includes(draw.bonus);

  let tier = "Sin premio";
  const m = matched.length;
  if (m === MAIN_COUNT) {
    tier = draw.bonus != null && bonusMatched ? "Premio mayor (bono)" : "Premio mayor";
  } else if (m === MAIN_COUNT - 1 && bonusMatched) {
    tier = "Segundo premio";
  } else if (m === MAIN_COUNT - 1) {
    tier = "Tercer premio";
  } else if (m === MAIN_COUNT - 2) {
    tier = "Cuarto premio";
  } else if (m === MAIN_COUNT - 3) {
    tier = "Quinto premio";
  }

  return { matched, matchedCount: m, bonusMatched, tier };
}

export function prizeForTier(tier: string): string {
  switch (tier) {
    case "Premio mayor":
    case "Premio mayor (bono)":
      return "Mayor";
    case "Segundo premio":
      return "Importante";
    case "Tercer premio":
      return "Menor";
    case "Cuarto premio":
      return "Pequeño";
    case "Quinto premio":
      return "Simbólico";
    default:
      return "-";
  }
}