import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/component";
import NextLink from "next/link";
import IssueActions from "./IssueActions";
import { Issues, Status } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

interface Prop {
  searchParams: {
    status: Status;
    orderBy: keyof Issues;
    sortOrder: "asc" | "desc";
  };
}

const IssuesPage = async ({ searchParams }: Prop) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const headerTitle: {
    label: string;
    value: keyof Issues;
    className?: string;
  }[] = [
    { label: "Issues", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const orderBy = headerTitle
    .map((title) => title.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : undefined;

  const issues = await prisma.issues.findMany({
    where: {
      status: status,
    },
    orderBy,
  });

  const getNextSortOrder = (currentSortOrder: "asc" | "desc") => {
    return currentSortOrder === "asc" ? "desc" : "asc";
  };

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {headerTitle.map((title) => (
              <Table.ColumnHeaderCell
                key={title.label}
                className={title?.className}
              >
                {/* {title.label} */}
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: title.value,
                      sortOrder:
                        searchParams.orderBy === title.value
                          ? getNextSortOrder(searchParams.sortOrder)
                          : "asc",
                    },
                  }}
                >
                  {title.label}
                </NextLink>
                {title.value === searchParams.orderBy &&
                  (searchParams.sortOrder === "asc" ? (
                    <ArrowUpIcon className="inline" />
                  ) : (
                    <ArrowDownIcon className="inline" />
                  ))}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

// export const dynamic = "force-dynamic";

export default IssuesPage;
