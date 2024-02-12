import { Typography } from "@mui/material";

export default function FormTitle({title, formType}) {
  return (
    <>
      {formType !== "view" ? (
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#525252"
          align="center"
          pb={2}
        >
          {title}
        </Typography>
      ) : null}
    </>
  );
}
