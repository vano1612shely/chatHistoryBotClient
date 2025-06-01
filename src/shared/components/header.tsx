import { Button, Link, Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { useAuthStore } from "@/store/auth.store.ts";

export const Header = () => {
  const clear = useAuthStore((state) => state.clear);
  return (
    <Navbar>
      <NavbarContent className="flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/dashboard/channels">Список каналів</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/dashboard/users">Користувачі</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/dashboard/bot">Бот</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            onPress={() => clear()}
            href="/login"
            variant="flat"
          >
            Вийти
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
