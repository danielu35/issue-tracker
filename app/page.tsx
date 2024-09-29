import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

// interface Props {
//   searchParams: searchParams;
// }

// interface searchParams {
//   page: string;
// }

// export default function Home({ searchParams }: { searchParams: { page: string } }) {
export default async function Home() {
  const open = await prisma.issues.count({ where: { status: "OPEN" } });
  const inProgress = await prisma.issues.count({
    where: { status: "IN_PROGRESS" },
  });
  const closed = await prisma.issues.count({ where: { status: "CLOSED" } });
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summery of project issues",
};
