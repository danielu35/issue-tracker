import prisma from "@/prisma/client";
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
      <p>{issue?.title}</p>
      <p>{issue?.status}</p>
      <p>{issue?.description}</p>
      <p>{issue?.createdAt.toDateString()}</p>
    </div>
  );
};

export default IssueDetailPage;
