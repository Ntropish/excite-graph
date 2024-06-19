import { Box } from "@mui/material";

const DrawerHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        px: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default DrawerHeader;
