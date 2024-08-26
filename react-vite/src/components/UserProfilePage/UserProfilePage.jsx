import { useParams } from "react-router-dom";
import UserProfileForm from "./UserProfileForm";

const UserProfilePage = () => {
  const { userId } = useParams();

  return (
    <div className="user-profile-page">
      <UserProfileForm userId={parseInt(userId, 10)} />
    </div>
  );
};

export default UserProfilePage;
