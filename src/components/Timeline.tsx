import React, { useState, useEffect } from "react";
import {
  Stack,
  Button,
  Switch,
  TextField,
  FormControlLabel,
} from "@mui/material";
import usePop from "../hooks/usePop";

const Timeline = () => {
  const { pop } = usePop();
  const [autoStep, setAutoStep] = useState(false);
  const [stepInterval, setStepInterval] = useState(1000); // Default step interval is 1000ms (1 second)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoStep) {
      interval = setInterval(() => {
        pop();
      }, stepInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoStep, stepInterval, pop]);

  const handleAutoStepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoStep(event.target.checked);
  };

  const handleStepIntervalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const interval = Math.max(Number(event.target.value), 100); // Ensure the interval is not less than 100ms
    setStepInterval(interval);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Button onClick={pop}>Step</Button>
      <FormControlLabel
        control={<Switch checked={autoStep} onChange={handleAutoStepChange} />}
        label="Auto-Step"
      />
      <TextField
        label="Step Interval (ms)"
        type="number"
        variant="outlined"
        value={stepInterval}
        onChange={handleStepIntervalChange}
      />
    </Stack>
  );
};

export default Timeline;
