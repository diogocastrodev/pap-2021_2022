import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardPage from "@components/Dashboard/DashboardPage";

export default function FolderData() {
  const [id, setId] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    setId(router.query.id?.toString() as string);
  }, [router.isReady]);

  useEffect(() => {
    setId(router.query.id?.toString() as string);
  }, [router.query.id]);

  return (
    <>
      <DashboardPage
        folder={{
          id,
        }}
      />
    </>
  );
}
