import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, CardFooter } from "@heroui/react";
import { useAppForm } from "@/shared/hooks/form.tsx";
import { z } from "zod";
import { CardBody, CardHeader } from "@heroui/card";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useState } from "react";
import { useLogin } from "@/modules/auth/useLogin.ts";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate({ from: "/login" });
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const { mutate, isPending } = useLogin({
    onSuccess: () => navigate({ to: "/" }),
  });

  const schema = z.object({
    login: z.string(),
    password: z.string(),
  });
  const form = useAppForm({
    defaultValues: {
      login: "",
      password: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });
  return (
    <div className="App ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="w-full h-[100vh] flex items-center justify-center"
      >
        <Card className="flex w-72">
          <CardHeader>Авторизація</CardHeader>
          <CardBody className="grid gap-5">
            <form.AppField
              name="login"
              children={(field) => (
                <field.TextField
                  label="Логін"
                  startContent={<User className="text-default-400" />}
                />
              )}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label={"Пароль"}
                  type={isVisible ? "text" : "password"}
                  startContent={<Lock className="text-default-400" />}
                  endContent={
                    <button type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              )}
            />
          </CardBody>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isPending}
            >
              Увійти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
