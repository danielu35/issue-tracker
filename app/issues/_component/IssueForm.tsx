"use client";

import { ErrorMessage, Spinner } from "@/app/component";
import { issueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issues } from "@prisma/client";
import { Button, Callout, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiFillInfoCircle } from "react-icons/ai";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof issueSchema>;

interface Props {
  issue?: Issues;
}

const IssueForm = ({ issue }: Props) => {
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const route = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch("/api/issues/" + issue.id, data);
      else await axios.post("/api/issues", data);
      route.push("/issues");
      route.refresh();
    } catch (error) {
      setSubmitting(false);
      setError("Unexpected error");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className=" mb-5">
          <Callout.Icon>
            <AiFillInfoCircle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root
          defaultValue={issue?.title}
          placeholder="Title"
          {...register("title")}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="status"
          control={control}
          defaultValue={issue?.status}
          render={({ field }) => (
            <Select.Root value={field.value} onValueChange={field.onChange}>
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Status</Select.Label>
                  <Select.Item value="OPEN">Open</Select.Item>
                  <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                  <Select.Item value="CLOSED">Closed</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
