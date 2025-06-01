import { useBot } from "@/modules/bot/useBot.ts";
import { Button, ButtonGroup, Card, Link, Spinner } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import { CreateBot } from "@/modules/bot/createBot.tsx";
import { Pause, Play, Trash } from "lucide-react";
import { useStartBot } from "@/modules/bot/useStartBot.ts";
import { useStopBot } from "@/modules/bot/useStopBot.ts";
import { useDeleteBot } from "@/modules/bot/useDeleteBot.ts";
import { SendMessage } from "@/modules/bot/sendMessage.tsx";

export const BotFlow = () => {
  const { data, isLoading } = useBot();
  const currentBot = data && data?.length > 0 ? data[0] : null;
  const { mutate: start, isPending: isPendingStart } = useStartBot();
  const { mutate: stop, isPending: isPendingStop } = useStopBot();
  const { mutate: handleDelete, isPending: isPendingDelete } = useDeleteBot();
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  if (data) {
    return (
      <Card>
        <CardHeader>Налаштування telegram bot</CardHeader>
        <CardBody>
          {!currentBot && (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Бот відсутній!</h2>
              <CreateBot />
            </div>
          )}
          {currentBot && (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex gap-2 items-end">
                Бот
                <Link
                  className="text-xl font-semibold"
                  href={`https://t.me/${currentBot.username}`}
                >
                  {currentBot.name}
                </Link>
              </h2>
              <ButtonGroup>
                <Button
                  color="success"
                  isIconOnly
                  isDisabled={currentBot.isActive}
                  isLoading={isPendingStart}
                  onPress={() => start({ id: currentBot.id })}
                >
                  <Play />
                </Button>
                <Button
                  color="warning"
                  isIconOnly
                  isDisabled={!currentBot.isActive}
                  isLoading={isPendingStop}
                  onPress={() => stop({ id: currentBot.id })}
                >
                  <Pause />
                </Button>
                <Button
                  color="danger"
                  isIconOnly
                  isLoading={isPendingDelete}
                  onPress={() => handleDelete({ id: currentBot.id })}
                >
                  <Trash />
                </Button>
                <SendMessage bot_id={currentBot.id} />
              </ButtonGroup>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
};
