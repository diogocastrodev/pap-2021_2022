import { useRouter } from "next/router";
import ProfilePageComp from "@src/components/Profile/ProfilePage";

export default function ProfilePageById() {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return <div>Id should be a string</div>;

  return (
    <>
      <ProfilePageComp public_id={id} />
    </>
  );
}
