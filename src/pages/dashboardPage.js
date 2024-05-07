import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import BarChart from "../components/dashboard/Charts/BarChart";
import PieChart from "../components/dashboard/Charts/PieChart";
import StatBox from "../components/dashboard/StatBox";
import Header from "../components/dashboard/Header";
import { tokens } from "../components/dashboard/theme";
import { allData } from "../utils/allData";
import LineChart from "../components/dashboard/Charts/LineChart";


function dataReduce(data) {
  if (!data) {
    return {
      vendedores: [],
      total_vendas: 0,
    };
  }

  const generosOrdenados = [];
  
  // Percorra os dados dos vendedores para coletar os gêneros únicos
  data.forEach((item) => {
    const livroGenero = item.livro_genero;
    
    if (!generosOrdenados.includes(livroGenero)) {
      generosOrdenados.push(livroGenero);
    }
  });
  

  const vendedoresData = data.reduce((result, item) => {
    const vendedorId = item.vendedor_id;
    const vendedorNome = item.vendedor_nome;
    const livroGenero = item.livro_genero;
    const valorTotal = parseFloat(item.valor_total);

    if (!result[vendedorId]) {
      result[vendedorId] = {
        id: vendedorId,
        nome: vendedorNome,
        data: generosOrdenados.map((genero) => ({
          x: genero,
          y: 0,
        })),
      };
    }

    const generoIndex = generosOrdenados.indexOf(livroGenero);

    if (generoIndex !== -1) {
      result[vendedorId].data[generoIndex].y += valorTotal;
    }

    return result;
  }, {});

  // Calcular a soma total de todas as vendas
  const somaTotalVendas = Object.values(vendedoresData).reduce((total, vendedor) => {
    return total + vendedor.data.reduce((subtotal, genero) => {
      return subtotal + genero.y;
    }, 0);
  }, 0);

  return {
    vendedores: Object.values(vendedoresData),
    total_vendas: somaTotalVendas,
  };
}




function dataAggregation(data) {
  if (!data) {
    return [];
  }

  const chartData = [];

  data.forEach((item) => {
    const entry = chartData.find((entry) => {
      return entry.bairro === item.bairro;
    });

    if (entry) {
      entry[item.genero] = item.quantidade;
    } else {
      const newEntry = { bairro: item.bairro };
      newEntry[item.genero] = item.quantidade;
      chartData.push(newEntry);
    }
  });

  return chartData;
}



function processData(data){


  

  const top_Generos = data.genero_mais_vendido || [];
const topGenero = top_Generos.length > 0
  ? top_Generos
  : { genero: 'N/A', quantidade: 0 };


  const livrosMaisVendidos = data.livros_mais_vendidos || [];
  const livrosMaisVendidosProcessed = livrosMaisVendidos.map((livro, i) => ({
  id: livro.id || 'N/A',
  nome: livro.nome || 'N/A',
  quantidade: livro.quantidade || 0,
}));

  const clientes ={
    total: data.clientes_total,
    flamengo: data.clientes_is_flamengo,
    one_piece : data.clientes_watch_onepiece
  }


  
  const chartData = dataAggregation(data.bairro_genero);

  

  const lineChartData = dataReduce(data.vendedor_genero_valor);
 console.log(lineChartData.total_vendas)

 const vendas_mesAnt = data.total_vendas_mes_anterior
  const vendas_mesAtual = lineChartData.total_vendas

  const diferencaVendas = vendas_mesAtual - vendas_mesAnt
  const diferencaPercentual = (vendas_mesAnt === null || vendas_mesAnt === 0) ? 100 : ((vendas_mesAnt - vendas_mesAtual) / vendas_mesAnt) * 100;
  const sinal = diferencaPercentual >= 0 ? '-' : '+';
  const diferencaPercentualComSinal = `${sinal}${Math.abs(diferencaPercentual)}%`;

  
  const valoresVendas ={
    vendas_mesAtual,
    vendas_mesAnt,
    diferencaAbsoluta: diferencaVendas,
    diferencaPercentual: diferencaPercentualComSinal
  }
  
  const dados = {
    valoresVendas,
    topGenero,
    livrosMaisVendidosProcessed,
    clientes,
    chartData,
    lineChartData
  };


  return dados

}

const servicePath = '/estatistica'
const  DashboardPage = (props) => {
    const colors = tokens;


  const [data, setData] = useState([]);

  // // const visualizarImpressao = () => {
  // //   const classeImpressao = new Impressao(data);
  // //   const documento = classeImpressao.gerarDocumento();
  // //   pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  // // }

  
  useEffect(() => {
    props.setIsLoading(true)

    allData(servicePath).then((data) => {
      setData(data);
    }).catch((error) => {
      console.log(error)
      props.setNotification({ erro: true, message: "Erro ao buscar a view" })
    })

    props.setIsLoading(false)
  }, [])
  
    const dadosProcessados = processData(data)

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />

        <Box>
          
        </Box>
      </Box>
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`R$ ${dadosProcessados.valoresVendas.vendas_mesAtual}`}
            subtitle="Total vendas Mês atual"
            progress={dadosProcessados.valoresVendas.diferencaPercentual}
            increase={dadosProcessados.valoresVendas.diferencaAbsoluta}
            icon={
              <AttachMoneyOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`R$ ${dadosProcessados.valoresVendas.diferencaAbsoluta}`}
            subtitle="Flutuações de Vendas"
            progress={dadosProcessados.valoresVendas.diferencaPercentual}
            increase={dadosProcessados.valoresVendas.diferencaPercentual}
            icon={
              <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dadosProcessados.topGenero.length > 0 ? dadosProcessados.topGenero[0].genero : 'N/A'}
            subtitle="Gênero mais popular"
            progress="100"
            increase={dadosProcessados.topGenero.length > 0 ? dadosProcessados.topGenero[0].quantidade : 0}
            icon={
              <BookOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />

        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dadosProcessados.clientes.total}
            subtitle="Total de clientes"
            progress="100"
            increase="100%"
            icon={
              <PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontSize="16px" fontWeight="600" color={colors.grey[100]}>
              Vendas realizadas
              </Typography>
              <Typography fontSize="24px" fontWeight="bold" color={colors.greenAccent[500]}>
                R${dadosProcessados.lineChartData.total_vendas}
              </Typography>
            </Box>

            
          </Box>

          <Box height="250px" mt="-20px">
            <LineChart  data={dadosProcessados.lineChartData.vendedores} />
          </Box>
        </Box>
        {/* TRANSACTIONS */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} fontSize="16px" fontWeight="600">
                Livros mais vendidos
            </Typography>
          </Box>

          {dadosProcessados.livrosMaisVendidosProcessed.map((transaction, i) => (
                            <Box
                              key={`${transaction.id}-${i}`}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              borderBottom={`2px solid ${colors.primary[800]}`}
                              p="15px"
                            >
                              <Box >
                                <Typography color={colors.greenAccent[500]} fontSize="16px" fontWeight="600">
                                  {`${i + 1}º`} {/* Adicione 1 ao índice para obter a posição */}
                                </Typography>

                                <Typography color={colors.greenAccent[100]}>
                                  {transaction.nome}
                                </Typography>
                              </Box>
                              <Box borderLeft={`1px solid ${colors.primary[800]}`} alignItems="center"  color={colors.grey[100]}>
                                
                                <Box color={colors.grey[900]} backgroundColor={colors.greenAccent[500]} ml="10px" p="5px 10px" borderRadius="4px">
                                  {transaction.quantidade}
                                </Box>
                              </Box>
                            </Box>
                          ))}

            </Box>
        {/* ROW 3 */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography fontSize="16px" fontWeight="600">
            Campaign
          </Typography>
          <Box height="300px" mt="-20px">         
           <PieChart
                  clientesTotal={dadosProcessados.clientes.total}
                  clientesIsFlamengo={dadosProcessados.clientes.flamengo}
                  clientesWatchOnePiece={dadosProcessados.clientes.one_piece}
                />
            {/* <Typography fontSize="16px" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              $48,352 revenue Generated
            </Typography>
            <Typography fontSize="16px" fontWeight="600">
              Includes Extra misx expenditures and costs
            </Typography> */}
          </Box>
        </Box>
        {/*  */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography fontSize="16px" fontWeight="600" sx={{ p: "30px 30px 0 30px" }}>
            Quantidade de vendas por bairro
          </Typography>
          <Box display="flex" alignItems="center" height="100%" width="100%" mt="-20px">
            <BarChart isDashboard={true} data={dadosProcessados.chartData }/>
          </Box>
        </Box>

        {/*  */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} fontSize="16px" fontWeight="600">
                Gêneros mais vendidos
            </Typography>
          </Box>

          {Array.isArray(dadosProcessados.topGenero) ? (
  dadosProcessados.topGenero.map((transaction, i) => (
    <Box
      key={`${transaction.genero}-${i}`}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`2px solid ${colors.primary[800]}`}
      p="15px"
    >
      <Box>
        <Typography color={colors.greenAccent[500]} fontSize="16px" fontWeight="600">
          {`${i + 1}º`} {/* Adicione 1 ao índice para obter a posição */}
        </Typography>
        <Typography color={colors.greenAccent[100]}>
          {transaction.genero}
        </Typography>
      </Box>
      <Box borderLeft={`1px solid ${colors.primary[800]}`} alignItems="center" color={colors.grey[100]}>
        <Box color={colors.grey[900]} backgroundColor={colors.greenAccent[500]} ml="10px" p="5px 10px" borderRadius="4px">
          {transaction.quantidade}
        </Box>
      </Box>
    </Box>
  ))
) : (
  <div>Os dados de topGenero não estão no formato esperado.</div>
)}

        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;