import { Button, ButtonGroup, Card, Input } from "@heroui/react";
import { CardBody, CardHeader } from "@heroui/card";
import { useEffect, useState } from "react";
import { apiClient } from "@/shared/api/apiClient.ts";
import { useStop } from "@/modules/userbot/useStop.ts";
import { Pause, Play, Trash } from "lucide-react";
import { useStart } from "@/modules/userbot/useStart.ts";
import { useBotStatus } from "@/modules/userbot/useBotStatus.ts";
import { useDelete } from "@/modules/userbot/useDelete.ts";
const SessionId = "userbot";
export const UserBotFlow = () => {
  const [step, setStep] = useState(0);
  const { data: authStatus, refetch } = useBotStatus(SessionId);
  const [apiId, setApiId] = useState("");
  const [apiHash, setApiHash] = useState("");
  const [authInput, setAuthInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: handleStop, isPending: isPendingStop } = useStop();
  const { mutate: handleDelete, isPending: isPendingDelete } = useDelete();
  const { mutate: handleStart, isPending: isPendingStart } = useStart({
    onSuccess: () => {
      setStep(2);
    },
    onMutate: () => {
      pollAuthStatus();
    },
  });
  const handleCreateSession = async () => {
    setIsLoading(true);
    await apiClient.post({
      url: "/userbot/create-session",
      payload: {
        sessionId: SessionId,
        apiId: Number(apiId),
        apiHash,
      },
    });
    setIsLoading(false);
    setStep(1);
  };
  const handleSubmitAuth = async () => {
    setIsLoading(true);
    await apiClient.post({
      url: `/userbot/${SessionId}/auth`,
      payload: { value: authInput },
    });
    pollAuthStatus();
    setIsLoading(false);
    setAuthInput("");
  };
  const pollAuthStatus = async () => {
    if (!authStatus?.exists) {
      setStep(0);
    }
    if (authStatus?.awaitingAuth) {
      setStep(2);
    }
    if (authStatus?.exists && !authStatus?.awaitingAuth) {
      setStep(4);
    }
    if (!authStatus?.awaitingAuth && authStatus?.started) {
      setStep(4);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => refetch(), 2000);
    pollAuthStatus();
    return () => {
      clearInterval(interval);
    };
  }, [authStatus]);
  return (
    <Card>
      <CardHeader>Налаштування userbot</CardHeader>
      <CardBody>
        {step === 0 && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="API ID"
              value={apiId}
              onValueChange={(value) => setApiId(value)}
            />
            <Input
              type="text"
              placeholder="API Hash"
              value={apiHash}
              onValueChange={(value) => setApiHash(value)}
            />
            <Button
              isLoading={isLoading}
              color="primary"
              onPress={handleCreateSession}
            >
              Створити сесію
            </Button>
          </div>
        )}
        {step === 1 && (
          <Button
            color="primary"
            isLoading={isPendingStart}
            onPress={() => handleStart(SessionId)}
          >
            Запустити клієнт
          </Button>
        )}
        {step === 2 && authStatus?.awaitingAuth && (
          <div className="space-y-2">
            <p>
              Очікування <strong>{authStatus.authType}</strong>
            </p>
            <Input
              type="text"
              placeholder={`Enter ${authStatus.authType}`}
              value={authInput}
              onValueChange={(value) => setAuthInput(value)}
            />
            <Button
              isLoading={isLoading}
              color="primary"
              onPress={handleSubmitAuth}
            >
              Відправити
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Бот запущений</h2>
            <ButtonGroup>
              <Button
                isDisabled={authStatus?.started}
                color="success"
                onPress={() => handleStart(SessionId)}
                isLoading={isPendingStart}
                isIconOnly
              >
                <Play />
              </Button>
              <Button
                isDisabled={!authStatus?.started}
                color="warning"
                onPress={() => handleStop(SessionId)}
                isLoading={isPendingStop}
                isIconOnly
              >
                <Pause />
              </Button>
              <Button
                color="danger"
                onPress={() => handleDelete(SessionId)}
                isLoading={isPendingDelete}
                isIconOnly
              >
                <Trash />
              </Button>
            </ButtonGroup>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
