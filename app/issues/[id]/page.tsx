import prisma from "@/prisma/client";
import { Box, Grid, Flex } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";

interface Prop {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Prop) => {
  const issue = await prisma.issues.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue?.id) notFound();
  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap={"5"}>
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      <Box className="col-span-1">
        <Flex direction="column" gap={"4"}>
          <EditIssueButton issueId={issue.id} />
          <DeleteIssueButton issueId={issue.id} />
        </Flex>
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
