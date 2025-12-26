import { BASE_URL } from "../utils/apiPaths";
import defaultAvatar from "../assets/default-avatar.png";

 const getAvatarUrl = (profileImageUrl) => {
  if (!profileImageUrl) return defaultAvatar;

  // already full URL
  if (profileImageUrl.startsWith("http")) {
    return profileImageUrl;
  }

  // relative path from backend
  return `${BASE_URL}/${profileImageUrl}`;
};


export default getAvatarUrl;