import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Send } from "lucide-react";
import { useChannelsList } from "@/modules/channels/useChannelsList.ts";
import { useEffect, useState } from "react";
import { useAppForm } from "@/shared/hooks/form.tsx";
import {
  fileToBase64,
  type SendMessageData,
  useSendMessage,
} from "@/modules/bot/useSendMessage.ts";

export const SendMessage = ({
  bot_id,
  client_id,
}: {
  bot_id: number;
  client_id?: number;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data, isLoading } = useChannelsList({
    enabled: isOpen,
  });

  const mediaTypeOptions = [
    { key: "", label: "Без медіа" },
    { key: "photo", label: "Фото" },
    { key: "video", label: "Відео" },
    { key: "audio", label: "Аудіо" },
    { key: "document", label: "Документ" },
  ];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setFieldValue("mediaFilename", file.name);

      // Set media type based on file type
      if (file.type.startsWith("image/")) {
        form.setFieldValue("mediaType", "photo");
      } else if (file.type.startsWith("video/")) {
        form.setFieldValue("mediaType", "video");
      } else if (file.type.startsWith("audio/")) {
        form.setFieldValue("mediaType", "audio");
      } else {
        form.setFieldValue("mediaType", "document");
      }
    }
  };
  const { mutate, isPending } = useSendMessage({
    onSuccess: () => onClose(),
  });
  const form = useAppForm({
    defaultValues: {
      botId: bot_id,
      message: "",
      client_id: client_id,
      channelId: "",
      buttonText: "",
      mediaType: "" as "photo" | "video" | "audio" | "document" | undefined,
      mediaFilename: "",
      isBroadcast: !client_id,
    },
    onSubmit: async ({ value }) => {
      try {
        let mediaFile: string | undefined;
        if (selectedFile) {
          mediaFile = await fileToBase64(selectedFile);
        }

        const submitData: SendMessageData = {
          ...value,
          mediaFile,
        };

        mutate(submitData);
      } catch (error) {
        console.error("Помилка підготовки даних:", error);
      }
    },
  });
  useEffect(() => {
    if (isOpen) form.reset();
  }, [isOpen]);
  return (
    <>
      <Button onPress={onOpen} color="primary" isIconOnly>
        <Send />
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
            <ModalHeader>Відправити повідомлення</ModalHeader>
            <ModalBody>
              <form.AppField
                name="mediaType"
                children={(field) => (
                  <field.SelectField
                    label="Тип медіа"
                    items={mediaTypeOptions}
                    placeholder="Оберіть тип медіа"
                  />
                )}
              ></form.AppField>

              <form.Field name="mediaType">
                {(mediaTypeField) =>
                  mediaTypeField.state.value && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Медіафайл
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept={
                          mediaTypeField.state.value === "photo"
                            ? "image/*"
                            : mediaTypeField.state.value === "video"
                              ? "video/*"
                              : mediaTypeField.state.value === "audio"
                                ? "audio/*"
                                : "*/*"
                        }
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-600">
                          Обрано: {selectedFile.name} (
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  )
                }
              </form.Field>

              <form.AppField
                name="message"
                children={(field) => (
                  <field.TextAreaField label="Повідомлення" />
                )}
              />
              <form.AppField
                name="channelId"
                children={(field) => (
                  <field.SelectWithSearchField
                    label="Прив'язати канал"
                    items={
                      data?.map((i) => ({ key: i.id, label: i.name })) || []
                    }
                    isLoading={isLoading}
                  />
                )}
              />
              <form.AppField
                name="buttonText"
                children={(field) => <field.TextField label="Назва кнопки" />}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" isLoading={isPending}>
                Відправити
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
