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
} from "@heroui/react";

export const Route = createFileRoute("/dashboard/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useClients();
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  const pages = Math.ceil(data?.length || 0 / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data?.slice(start, end) || [];
  }, [page, data]);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
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
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "username" ? (
                  <Link href={`https://t.me/${item.username}`}>
                    @{getKeyValue(item, columnKey)}
                  </Link>
                ) : (
                  getKeyValue(item, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
