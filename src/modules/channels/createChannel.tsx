import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useCreateChannel } from "@/modules/channels/useCreateChannel.ts";
import { useAppForm } from "@/shared/hooks/form.tsx";
import { z } from "zod";
import { Plus } from "lucide-react";

export const CreateChannel = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutate, isPending } = useCreateChannel({
    onSuccess: () => onClose(),
  });
  const schema = z.object({
    name: z.string(),
    telegramChannelId: z.string().min(1),
  });
  const form = useAppForm({
    defaultValues: {
      name: "",
      telegramChannelId: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });
  return (
    <>
      <Button onPress={onOpen} color="primary" endContent={<Plus />}>
        Додати канал
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <ModalHeader>Додати канал</ModalHeader>
            <ModalBody>
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Назва" />}
              />
              <form.AppField
                name="telegramChannelId"
                children={(field) => (
                  <field.TextField label="ID телеграм каналу" />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" isLoading={isPending}>
                Додати
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
