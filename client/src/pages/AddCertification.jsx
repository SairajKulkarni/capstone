import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";

const AddCertification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    certName: "",
    organization: "",
    certId: "",
    certUrl: "",
    issueDate: "",
    expiryDate: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await axios.post("/api/certifications/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      enqueueSnackbar("Certification uploaded successfully!", { variant: "success" });
      // Optional: Redirect or clear form
    } catch (err) {
      enqueueSnackbar("Error uploading certification", { variant: "error" });
    } finally {
      setIsSubmitting(false);
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
        <TextField
          fullWidth
          type="date"
          label="Issue Date"
          name="issueDate"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.issueDate}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          type="date"
          label="Expiry Date (Optional)"
          name="expiryDate"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={formData.expiryDate}
          onChange={handleChange}
        />

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
    </Box>
  );
};

export default AddCertification;
