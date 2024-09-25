import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import Pagination from "../component/Pagination";
import IssuesTable, { columnNames, IssueQuery } from "./_component/IssuesTable";
import IssueActions from "./IssueActions";
import { Flex } from "@radix-ui/themes";

interface Prop {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Prop) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const where = { status };

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.sortOrder }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  // Add a drop down to allow user to select the page size. TODO
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

// export const dynamic = "force-dynamic";

export default IssuesPage;
