import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";

// Type definitions
interface MachineState {
  color: string;
  duration: number;
}

interface MachineData {
  name: string;
  time: string;
  percentage: string;
  states: MachineState[];
  status: string;
  statusTime: string;
  image: string;
}

interface MachineBarProps {
  machineData: MachineData;
}

// A function to represent each machine's data bar
const MachineBar: React.FC<MachineBarProps> = ({ machineData }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    <Box sx={{ width: 120, mr: 2 }}>
      <Typography variant="body2">{machineData.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        {machineData.time} hrs, {machineData.percentage}
      </Typography>
    </Box>
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      {machineData.states.map((state, index) => (
        <Box
          key={index}
          sx={{
            height: 20,
            backgroundColor: state.color,
            width: `${state.duration}%`,
          }}
        />
      ))}
    </Box>
  </Box>
);

// Legend component
const Legend: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mb: 3,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#4caf50", mr: 1 }} />
      <Typography variant="caption">Start</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#f44336", mr: 1 }} />
      <Typography variant="caption">Stop</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#ffeb3b", mr: 1 }} />
      <Typography variant="caption">Idle</Typography>
    </Box>
  </Box>
);

// Main component
const MachineStatus: React.FC = () => {
  const machines: MachineData[] = [
    {
      name: "Machine 1",
      time: "3.0",
      percentage: "46.7% (+9.2%)",
      states: [
        { color: "#4caf50", duration: 10 }, // Start
        { color: "#f44336", duration: 15 }, // Stop
        { color: "#4caf50", duration: 10 }, // Start
        { color: "#ffeb3b", duration: 5 }, // Idle
        { color: "#4caf50", duration: 20 }, // Start
        { color: "#f44336", duration: 10 }, // Stop
        { color: "#4caf50", duration: 10 }, // Start
        { color: "#f44336", duration: 20 }, // Stop
      ],
      status: "Down-Fixing",
      statusTime: "39 minutes",
      image: "/path/to/image1.jpg",
    },
    {
      name: "Machine 2",
      time: "3.5",
      percentage: "55.9% (-22.6%)",
      states: [
        { color: "#4caf50", duration: 20 }, // Start
        { color: "#f44336", duration: 10 }, // Stop
        { color: "#4caf50", duration: 20 }, // Start
        { color: "#ffeb3b", duration: 5 }, // Idle
        { color: "#f44336", duration: 15 }, // Stop
        { color: "#4caf50", duration: 20 }, // Start
        { color: "#f44336", duration: 10 }, // Stop
      ],
      status: "Running",
      statusTime: "3 minutes",
      image: "/path/to/image2.jpg",
    },
    {
      name: "Machine 3",
      time: "4.6",
      percentage: "72.2% (-1.6%)",
      states: [
        { color: "#4caf50", duration: 15 }, // Start
        { color: "#f44336", duration: 10 }, // Stop
        { color: "#4caf50", duration: 15 }, // Start
        { color: "#ffeb3b", duration: 5 }, // Idle
        { color: "#f44336", duration: 15 }, // Stop
        { color: "#4caf50", duration: 25 }, // Start
        { color: "#f44336", duration: 10 }, // Stop
      ],
      status: "Running",
      statusTime: "1 minute",
      image: "/path/to/image3.jpg",
    },
    {
      name: "Machine 4",
      time: "5.2",
      percentage: "81.6% (+18.5%)",
      states: [
        { color: "#4caf50", duration: 25 }, // Start
        { color: "#f44336", duration: 5 }, // Start
        { color: "#4caf50", duration: 5 }, // Start
        { color: "#f44336", duration: 5 }, // Start
        { color: "#f44336", duration: 5 }, // Start
        { color: "#4caf50", duration: 5 }, // Start
        { color: "#f44336", duration: 5 }, // Start
        { color: "#4caf50", duration: 5 }, // Stop
        { color: "#ffeb3b", duration: 5 }, // Idle
        { color: "#4caf50", duration: 25 }, // Start
        { color: "#f44336", duration: 5 }, // Stop
        { color: "#4caf50", duration: 15 }, // Start
        { color: "#f44336", duration: 5 }, // Stop
        { color: "#4caf50", duration: 15 }, // Start
      ],
      status: "Running",
      statusTime: "2 hours",
      image: "/path/to/image4.jpg",
    },
  ];

  return (
    <Box p={3}>
      <Legend />
      {machines.map((machine, index) => (
        <Paper key={index} sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <MachineBar machineData={machine} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">{machine.statusTime}</Typography>
                <Typography
                  variant="caption"
                  color={machine.status.includes("Running") ? "green" : "red"}
                >
                  {machine.status}
                </Typography>
                <Box
                  component="img"
                  src={machine.image}
                  alt={machine.status}
                  sx={{ width: "100%", mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default MachineStatus;
