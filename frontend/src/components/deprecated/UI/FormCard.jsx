import { Grid, Paper } from "@mui/material";

export default function FormCard({ children }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Paper elevation={10}>{children}</Paper>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </>
  );
}
