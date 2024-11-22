import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({ label, value, error, onChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <TextField
      required
      label={label}
      value={value}
      error={error}
      onChange={onChange}
      type={passwordVisibility ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setPasswordVisibility((prev) => !prev)}
              >
                {passwordVisibility ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

PasswordField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
};

export default PasswordField;
