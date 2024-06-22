import { Stack, Button } from "@mui/material";

import usePop from "../hooks/usePop";

const Timeline = () => {
  const { pop } = usePop();

  return (
    <Stack direction="column">
      <Button onClick={pop}>Step</Button>
    </Stack>
  );
};

export default Timeline;
