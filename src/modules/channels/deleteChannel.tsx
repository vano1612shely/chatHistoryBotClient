import { Button } from "@heroui/react";
import { useDeleteChannel } from "@/modules/channels/useDeleteChannel.ts";
import { Trash } from "lucide-react";

export const DeleteChannel = ({ id }: { id: string }) => {
  const { mutate, isPending } = useDeleteChannel();
  return (
    <Button
      color="danger"
      isLoading={isPending}
      onPress={() => mutate({ id })}
      isIconOnly
    >
      <Trash />
    </Button>
  );
};
