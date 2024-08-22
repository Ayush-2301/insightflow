import { getProfile } from "@/lib/actions/profile";
import ProfileForm from "./ProfileForm";

const ProfileServer = async () => {
  const profile = await getProfile();
  if ("error" in profile) return <>{profile.error}</>;
  return <ProfileForm initialData={profile} />;
};

export default ProfileServer;
