import { TextField } from "@mui/material";

export default function TicketNumber({ formData, name }) {
  return (
    <>
      <TextField
        id="ticketNumber"
        label="Ticket Number"
        variant="filled"
        name="ticketNumber"
        type="text"
        value={formData[name] ? formData[name].slice(0, 8) : "Not Created"}
        disabled
        fullWidth
      />
    </>
  );
}
