import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/component";
import IssuesToolBar from "./IssuesToolBar";

const IssuesPage = async () => {
  const issues = await prisma.issues.findMany();

  const headerTitle = [
    { label: "Issues" },
    { label: "Status", className: "hidden md:table-cell" },
    { label: "Created", className: "hidden md:table-cell" },
  ];

  return (
    <div>
      <IssuesToolBar />
      <Table.Root variant="surface">
        <Table.Header>
          {headerTitle.map((title) => (
            <Table.ColumnHeaderCell
              key={title.label}
              className={title?.className}
            >
              {title.label}
            </Table.ColumnHeaderCell>
          ))}
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
