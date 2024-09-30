import prisma from "@/prisma/client";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import Pagination from "../component/Pagination";
import IssuesTable, { columnNames, IssueQuery } from "./_component/IssuesTable";
import { Status } from "./_component/status"; // Assuming this is your custom enum
import IssueActions from "./IssueActions";
import { Suspense } from "react";

interface Prop {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Prop) => {
  const {
    status: searchStatus,
    orderBy: searchOrderBy,
    sortOrder,
    page: pageParam,
  } = searchParams;

  // Check if the provided status is a valid key in your custom `Status` enum
  const validStatus =
    searchStatus && Object.values(Status).includes(searchStatus as Status)
      ? (searchStatus as Status)
      : undefined;

  // Construct the where clause
  const where = validStatus ? { status: validStatus } : {};

  const orderBy = columnNames.includes(searchOrderBy)
    ? { [searchOrderBy]: sortOrder }
    : undefined;

  const page = parseInt(pageParam) || 1; // Use the pageParam directly
  const pageSize = 10;

  const issues = await prisma.issues.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issues.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssuesTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};

const WrappedIssuesPage = (props: Prop) => (
  <Suspense fallback={<div>Loading...</div>}>
    <IssuesPage {...props} />
  </Suspense>
);

export default WrappedIssuesPage;