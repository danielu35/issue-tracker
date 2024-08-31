import dynamic from "next/dynamic";
import React from "react";
import IssueFormSkeleton from "./loading";

const IssueForm = dynamic(() => import("@/app/issues/_component/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
  return (
    <div>
      <IssueForm />
    </div>
  );
};

export default NewIssuePage;
