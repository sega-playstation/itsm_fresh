import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function TicketCreatedAt({ formData }) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Ticket Created At"
          value={new Date(formData.ticketDateTime)}
          slotProps={{ textField: { sx: { width: "100%" } }}}
          disabled
        />
      </LocalizationProvider>
    </>
  );
}
