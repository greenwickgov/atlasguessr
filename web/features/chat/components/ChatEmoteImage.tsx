import type { ChatEmote } from "../model/types";
import { chatEmotes } from "../lib/emotes";

const images: Record<ChatEmote, string> = {
  skull: "/atlasrush/emoji/mindblown.svg", sob: "/atlasrush/emoji/sob.svg",
  thinking: "/atlasrush/emoji/thinking.svg", sunglasses: "/atlasrush/emoji/sunglasses.svg",
  wave: "/atlasrush/emoji/wave.svg",
};
export function ChatEmoteImage({emote}: {emote?: ChatEmote}) {
  if (!emote) return null;
  return <img src={images[emote]} alt={chatEmotes.find(item => item.emote === emote)?.label || "Reaction"} className="atlas-emote" />;
}
