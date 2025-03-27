import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const AddCertification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    certName: "",
    organization: "",
    certId: "",
    issueDate: dayjs(),
    expiryDate: dayjs(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { user, setUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiResponse = await axios.post(
        "/api/verify/verify",
        { ...formData },
        { withCredentials: true }
      );
      enqueueSnackbar("Certificate successfully uploaded", {
        variant: "success",
      });
      setUser((prev) => {
        return {
          ...prev,
          certificates: [...prev.certificates, apiResponse.data.newCertificate],
        };
      });
      setFormData({
        certName: "",
        organization: "",
        certId: "",
        issueDate: dayjs(),
        expiryDate: dayjs(),
      });
    } catch (error) {
      if (error.status === 401) {
        enqueueSnackbar(
          "Either you are not the owner or the certificate expired",
          { variant: "error" }
        );
      } else if (error.status === 404) {
        enqueueSnackbar("Certificate not found", { variant: "error" });
      } else {
        enqueueSnackbar("Internal Server Error", { variant: "error" });
      }
    } finally {
      setIsSubmitting(false);
      console.log(user);
    }
  };

  return (
    <Box
      component={Paper}
      sx={{
        p: 4,
        maxWidth: "600px",
        margin: "50px auto",
      }}
    >
      <Typography variant="h5" mb={2}>
        Add New Certification
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Certificate Name"
            name="certName"
            margin="normal"
            value={formData.certName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Issuing Organization"
            name="organization"
            margin="normal"
            value={formData.organization}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Certificate ID"
            name="certId"
            margin="normal"
            value={formData.certId}
            onChange={handleChange}
            required
          />
          {isMobile ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              <MobileDatePicker
                // fullWidth
                required
                label={"Issue Date"}
                name="issueDate"
                value={formData.issueDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, issueDate: newValue }))
                }
              />
              <MobileDatePicker
                // fullWidth
                label={"Expiry Date (Optional)"}
                name="expiryDate"
                value={formData.expiryDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, expiryDate: newValue }))
                }
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              <DesktopDatePicker
                required
                label={"Issue Date"}
                name="issueDate"
                value={formData.issueDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, issueDate: newValue }))
                }
              />
              <DesktopDatePicker
                label={"Expiry Date (Optional)"}
                name="expiryDate"
                value={formData.expiryDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, expiryDate: newValue }))
                }
              />
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>
      </LocalizationProvider>
    </Box>
  );
};

export default AddCertification;
