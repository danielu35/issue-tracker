import prisma from "@/prisma/client";
import { Avatar, Box, Card, Flex, Heading, Table } from "@radix-ui/themes";
import React from "react";
import { IssueStatusBadge } from "./component";
import Link from "next/link";

const LatestIssues = async () => {
  const issues = await prisma.issues.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignToUser: true },
  });

  return (
    <Card>
      <Heading size="4" mb="5">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" align="start">
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                    <IssueStatusBadge status={issue.status} />
                  </Flex>
                  {issue.assignedToUserId && (
                    <Avatar src={issue.assignToUser?.image!} fallback="?" />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
