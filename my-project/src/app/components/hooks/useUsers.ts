import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      return res.json();
    },
  });
};
