import { createFileRoute } from "@tanstack/react-router";
import { useClients } from "@/modules/clients/useClients.ts";
import { useMemo, useState } from "react";
import {
  getKeyValue,
  Link,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@heroui/react";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { apiClient } from "@/shared/api/apiClient.ts";

export const Route = createFileRoute("/dashboard/users")({
  component: RouteComponent,
});

interface GrantSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramId: string;
  userName: string;
}

function GrantSubscriptionModal({
  isOpen,
  onClose,
  telegramId,
  userName,
}: GrantSubscriptionModalProps) {
  const [durationDays, setDurationDays] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!durationDays || parseInt(durationDays) < 1) {
      alert("Введіть коректну кількість днів");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post({
        url: `/client/telegram/${telegramId}/grant-subscription`,
        payload: {
          durationDays: parseInt(durationDays),
          note: note.trim() || undefined,
        },
      });
      if (response.data) {
        alert(
          `Підписку успішно видано користувачу ${userName} на ${durationDays} днів`,
        );
        setDurationDays("");
        setNote("");
        onClose();
        // Тут можна додати рефреш списку користувачів
        window.location.reload();
      } else {
        alert(`Помилка: ${response.message}`);
      }
    } catch (error) {
      alert("Помилка при видачі підписки");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDurationDays("");
    setNote("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Видати підписку користувачу {userName}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Кількість днів"
              placeholder="Введіть кількість днів підписки"
              type="number"
              min="1"
              max="3650"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              isRequired
            />
            <Textarea
              label="Примітка (необов'язково)"
              placeholder="Додаткова інформація про підписку"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
            <div className="text-sm text-gray-500">
              Telegram ID: {telegramId}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={handleClose}
            isDisabled={isLoading}
          >
            Скасувати
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Видати підписку
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function RouteComponent() {
  const { data, isLoading } = useClients();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<{
    telegramId: string;
    userName: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const rowsPerPage = 50;

  const pages = Math.ceil(data?.length || 0 / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data?.slice(start, end) || [];
  }, [page, data]);

  const handleGrantSubscription = (telegramId: string, userName: string) => {
    setSelectedUser({ telegramId, userName });
    onOpen();
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    onClose();
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div>
      <Table
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="id">ID</TableColumn>
          <TableColumn key="username">USERNAME</TableColumn>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="telegramId">CHAT_ID</TableColumn>
          <TableColumn key="firstName">FIRST_NAME</TableColumn>
          <TableColumn key="lastName">LAST_NAME</TableColumn>
          <TableColumn key="has_subscription">HAS_SUBSCRIPTION</TableColumn>
          <TableColumn key="subscription_end_date">
            SUBSCRIPTION_END_DATE
          </TableColumn>
          <TableColumn key="actions">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "subscription_end_date" ? (
                    getKeyValue(item, columnKey) ? (
                      dayjs(getKeyValue(item, columnKey)).format("DD.MM.YYYY")
                    ) : null
                  ) : columnKey === "has_subscription" ? (
                    getKeyValue(item, columnKey) ? (
                      "Так"
                    ) : (
                      "Ні"
                    )
                  ) : columnKey === "username" ? (
                    <Link href={`https://t.me/${item.username}`}>
                      @{getKeyValue(item, columnKey)}
                    </Link>
                  ) : columnKey === "actions" ? (
                    <Button
                      size="sm"
                      color="primary"
                      variant="light"
                      startContent={<Plus size={16} />}
                      onPress={() =>
                        handleGrantSubscription(
                          item.telegramId,
                          item.name ||
                            item.firstName ||
                            item.username ||
                            "Невідомий користувач",
                        )
                      }
                    >
                      Видати підписку
                    </Button>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedUser && (
        <GrantSubscriptionModal
          isOpen={isOpen}
          onClose={handleModalClose}
          telegramId={selectedUser.telegramId}
          userName={selectedUser.userName}
        />
      )}
    </div>
  );
}
