import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const PieChart = ({ clientesTotal, clientesIsFlamengo, clientesWatchOnePiece }) => {
  const colors = tokens;
  const percentIsFlamengo = (clientesIsFlamengo / clientesTotal) * 100;
  const percentWatchOnePiece = (clientesWatchOnePiece / clientesTotal) * 100;
  const percentOther = 100 - percentIsFlamengo - percentWatchOnePiece;

  const data = [
    {
      id: "Clientes Flamengo",
      label: "Clientes Flamengo",
      value: percentIsFlamengo,
      color: colors.redAccent[500],
    },
    {
      id: "Clientes One Piece",
      label: "Clientes One Piece",
      value: percentWatchOnePiece,
      color: colors.greenAccent[500],
    },
    {
      id: "Outros",
      label: "Outros",
      value: percentOther,
      color: colors.blueAccent[500],
    },
  ];

  return (
    <ResponsivePie
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[]}
      legends={[]} //remover legenda
      tooltip={({ datum }) => (
        <div style={{ color: "black", background: "white", padding: "5px", border: "1px solid #ccc" }}>
          <strong>{datum.label}:</strong> {datum.value.toFixed(2)}%
        </div>
      )}
      
      
      
    />
  );
};

export default PieChart;
