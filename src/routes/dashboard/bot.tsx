import { createFileRoute } from "@tanstack/react-router";
import { UserBotFlow } from "@/modules/userbot/UserBotFlow.tsx";
import { BotFlow } from "@/modules/bot/BotFlow.tsx";

export const Route = createFileRoute("/dashboard/bot")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-5">
      <div className="flex gap-5">
        <div className="flex-1">
          <UserBotFlow />
        </div>
        <div className="flex-1">
          <BotFlow />
        </div>
      </div>
    </div>
  );
}
