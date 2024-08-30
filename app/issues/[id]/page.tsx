import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

interface Prop {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Prop) => {
  const issue = await prisma.issues.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue?.id) notFound();
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
      <Box>
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <EditIssueButton issueId={issue.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
