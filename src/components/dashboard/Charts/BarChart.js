import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ data }) => {
  const bairros = data.map((item) => item.bairro);
  const generos = [...new Set(data.flatMap((item) => Object.keys(item).filter((key) => key !== "bairro")))];
  const dynamicKeys = generos;

  const chartData = bairros.map((bairro) => {
    const entry = { bairro };
    generos.forEach((genero) => {
      entry[genero] = parseInt(data.find((item) => item.bairro === bairro)[genero], 10) || 0;
    });
    return entry;
  });

  console.log(data[0])

  return (
    <ResponsiveBar
      data={chartData}
      keys={dynamicKeys}
      indexBy="bairro"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      axisBottom={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      enableLabel={false}
      labelSkipWidth={10}
      labelSkipHeight={12}
      legends={[
]}
    />
  );
};

export default BarChart;
