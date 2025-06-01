import { createFileRoute } from "@tanstack/react-router";
import { useChannelsList } from "@/modules/channels/useChannelsList.ts";
import { Card, Spinner } from "@heroui/react";
import { CreateChannel } from "@/modules/channels/createChannel.tsx";
import type { Channel } from "@/modules/channels/types.ts";
import { CardBody } from "@heroui/card";
import dayjs from "dayjs";
import { DeleteChannel } from "@/modules/channels/deleteChannel.tsx";

export const Route = createFileRoute("/dashboard/channels")({
  component: RouteComponent,
});

const ChannelCard = ({ item }: { item: Channel }) => {
  return (
    <Card className="w-96">
      <CardBody className="flex flex-row justify-between items-center">
        <div className="grid gap-2">
          <p className="text-default-600">
            Назва: <span className="text-black">{item.name}</span>
          </p>
          <p className="text-default-600">
            ID: <span className="text-black">{item.telegramChannelId}</span>
          </p>
          <p className="text-default-600">
            Дата створення:{" "}
            <span className="text-black">
              {dayjs(item.createdAt).format("DD.MM.YYYY HH:mm")}
            </span>
          </p>
        </div>
        <DeleteChannel id={item.id} />
      </CardBody>
    </Card>
  );
};

function RouteComponent() {
  const { data, isLoading } = useChannelsList();
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg"></Spinner>
      </div>
    );
  if (data)
    return (
      <div className="p-5">
        <div className="mb-5">
          <CreateChannel />
        </div>
        <div className="w-full max-h-[80svh] flex flex-wrap gap-3">
          {data.map((i) => {
            return <ChannelCard item={i} />;
          })}
        </div>
      </div>
    );
}
