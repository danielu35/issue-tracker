import React from "react";
import { Table } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import IssueStatusBadge from "../component/IssueStatusBadge";
import delay from "delay";
import IssuesToolBar from "./IssuesToolBar";
import Link from "../component/Link";

const IssuesPage = async () => {
  const issues = await prisma.issues.findMany();
  await delay(2000);

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

export default IssuesPage;
