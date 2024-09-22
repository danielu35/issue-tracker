"use client";

import { Issues, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/app/component";
import toast, { Toaster } from "react-hot-toast";

interface Prop {
  issue: Issues;
}

const AssigneeSelect = ({ issue }: Prop) => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <Skeleton />;

  if (error) return null;

  const assignIssue = (userId: string) => {
    try {
      axios.patch("/api/issues/" + issue.id, {
        assignedToUserId: userId === "null" ? null : userId,
      });
      if (userId === "null") return toast.success("Successfully unassigned");
      toast.success("Successfully assigned bug!");
      //This might not work ... if i have more than one user, now will it know what user to pick??
      //I will try this later when I have more test users.
      // {
      //   users?.map((user) =>
      //  toast.success("Successfully assigned to " + user.name)
      //   );
      // }
    } catch (error) {
      toast.error("Changes could not be saved.");
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={issue?.assignedToUserId || ""}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="null">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

export default AssigneeSelect;
