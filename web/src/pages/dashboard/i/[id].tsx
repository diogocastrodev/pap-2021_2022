import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardPage from "@components/Dashboard/DashboardPage";

export default function ItemData() {
  const [id, setId] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    setId(router.query.id?.toString() as string);
  }, [router.isReady]);

  return (
    <>
      <DashboardPage
        item={{
          id,
        }}
      />
    </>
  );
}
