import { Avatar } from "@mui/material";
import stringAvatar from "../utils/avatarString";
import PropTypes from "prop-types";

const UserAvatar = ({ user, style = {} }) => {
  return (
    <>
      {user.profilePic !== "" && user.profilePic !== undefined ? (
        <Avatar src={user.profilePic} sx={{ ...style }} />
      ) : (
        <Avatar {...stringAvatar(user.name, style)} />
      )}
    </>
  );
};

UserAvatar.propTypes = {
  user: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default UserAvatar;
