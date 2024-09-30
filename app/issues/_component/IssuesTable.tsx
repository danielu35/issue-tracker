import { IssueStatusBadge } from "@/app/component";
import { Issues } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import { default as Link, default as NextLink } from "next/link";
import { Status } from "./status";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issues;
  sortOrder: "asc" | "desc";
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issues[];
}

const IssuesTable = async ({ searchParams, issues }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = headerTitle
    .map((title) => title.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : undefined;

  const getNextSortOrder = (currentSortOrder: "asc" | "desc") => {
    return currentSortOrder === "asc" ? "desc" : "asc";
  };

  return (
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
                <IssueStatusBadge
                  status={Status[issue.status as keyof typeof Status]}
                />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge
                status={Status[issue.status as keyof typeof Status]}
              />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const headerTitle: {
  label: string;
  value: keyof Issues;
  className?: string;
}[] = [
  { label: "Issues", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  {
    label: "Created",
    value: "createdAt",
    className: "hidden md:table-cell",
  },
];

export const columnNames = headerTitle.map((column) => column.value);

export default IssuesTable;
