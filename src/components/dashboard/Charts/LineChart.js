import { ResponsiveBump } from '@nivo/bump'

const LineChart = ({ data }) => {
  console.log(data)
  // Converter os dados de reduceData para o formato esperado pelo Bump Chart
  const chartData = data.map((vendedor) => {
    return {
      id: vendedor.nome,
      data: vendedor.data.map((item) => ({
        x: item.x,
        y: item.y,
      })),
    };
  });

  return (
    <ResponsiveBump
      data={chartData}
      colors={{ scheme: 'spectral' }}
      lineWidth={3}
      activeLineWidth={6}
      inactiveLineWidth={3}
      inactiveOpacity={0.15}
      pointSize={10}
      activePointSize={16}
      inactivePointSize={0}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={3}
      activePointBorderWidth={3}
      pointBorderColor={{ from: 'serie.color' }}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -36,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{legend: ''}}
      margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
      axisRight={null}
      endLabel={false} // Remover os nomes dos vendedores no final das linhas
    />
  );
};
export default LineChart
