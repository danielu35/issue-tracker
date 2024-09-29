import prisma from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import IssueChart from "./IssueChart";

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
  return <IssueChart open={open} inProgress={inProgress} closed={closed} />;
}
