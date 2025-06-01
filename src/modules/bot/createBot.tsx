import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { z } from "zod";
import { useAppForm } from "@/shared/hooks/form.tsx";
import { Plus } from "lucide-react";
import { useCreateBot } from "@/modules/bot/useCreateBot.ts";
import { useState } from "react";
import { fileToBase64 } from "@/modules/bot/useSendMessage.ts";

export const CreateBot = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutate, isPending } = useCreateBot({
    onSuccess: () => onClose(),
  });
  const schema = z.object({
    name: z.string(),
    token: z.string(),
    startMessage: z.string(),
    file: z.string(),
  });
  const form = useAppForm({
    defaultValues: {
      name: "",
      token: "",
      startMessage: "",
      file: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      let mediaFile: string | undefined;
      if (selectedFile) {
        mediaFile = await fileToBase64(selectedFile);
      }
      mutate({ ...value, file: mediaFile });
    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  return (
    <>
      <Button onPress={onOpen} color="primary" endContent={<Plus />}>
        Створити бота
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
            <ModalHeader>Створити бота</ModalHeader>
            <ModalBody>
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Назва" />}
              />
              <form.AppField
                name="token"
                children={(field) => <field.TextField label="token боту" />}
              />
              <form.AppField
                name="startMessage"
                children={(field) => (
                  <field.TextAreaField label="Стартове повідомлення" />
                )}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Зображення для стартового повідомлення
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept={"image/*"}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Обрано: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" isLoading={isPending}>
                Створити
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
