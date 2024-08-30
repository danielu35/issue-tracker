import IssueStatusBadge from "@/app/component/IssueStatusBadge";
import prisma from "@/prisma/client";
import { Heading, Text, Flex, Card } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";

interface Prop {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Prop) => {
  const issue = await prisma.issues.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue?.id) notFound();
  return (
    <div>
      <Heading>{issue?.title}</Heading>
      <Flex gap="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue?.createdAt.toDateString()}</Text>
      </Flex>
      <Card>
        <p>{issue?.description}</p>
      </Card>
    </div>
  );
};

export default IssueDetailPage;
