import { IssueStatusBadge } from "@/app/component";
import { Issues } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

interface Props {
  issue: Issues;
}

const IssueDetails = ({ issue }: Props) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex gap="2" mt="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full" mt="4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
