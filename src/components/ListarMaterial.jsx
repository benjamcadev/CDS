import { useEffect, useState, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';
import { getArticulos } from '../helpers/getArticulos';
import { Button  } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetailModal from './Modals/Detail.Modal';



export const  MaterialDataGrid = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchArticulos = async (currentPage, currentPageSize) => {
    try {
      setLoading(true);
      const data = await getArticulos(currentPage + 1, currentPageSize); // +1 porque la API espera un índice de página basado en 1
      setArticulos(data.articulos);
      setTotalArticulos(data.total_Articulos);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const rowCountRef = useRef(totalArticulos);

  const rowCount = useMemo(() => {
    if (totalArticulos !== undefined) {
      rowCountRef.current = totalArticulos;
    }
    
    return rowCountRef.current;
  }, [totalArticulos]);

  const handleDetailClick = (row) => {
    setSelectedArticulo(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArticulo(null);
  };

  const columns = [
    { field: 'idarticulo', headerName: 'ID', align: 'center', width: 85 },
    { field: 'nombre', headerName: 'Nombre', width: 450 },
    { field: 'sap', headerName: 'SAP', headerAlign: 'center', width: 150 , headerAlign: 'center', align: 'center' },
    { field: 'codigo_interno', headerName: 'Código Interno', headerAlign: 'center', width: 150, align: 'center' },
    { field: 'unidad_medida', headerName: 'Unidad de Medida', width: 150, align: 'center' },
    { field: 'precio', headerName: 'Precio', headerAlign: 'center', type: 'number', width: 150, align: 'center' },
    { 
      field: 'Detalle', 
      headerName: 'Detalle', 
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Button
          color="warning"
          startIcon={<VisibilityIcon />}
          onClick={() => handleDetailClick(params.row)}
        >
        </Button>
      ),
    },
  ];

  
  if (error) return <p>Error loading materials: {error.message}</p>;

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <DataGrid
        rows={ articulos }
        columns={ columns }
        getRowId={(row) => row.idarticulo}
        rowCount={ rowCount }
        loading = { loading }
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
          },
        }}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
      />
      {selectedArticulo && (
        <DetailModal
          open={modalOpen}
          handleClose={handleCloseModal}
          article={selectedArticulo}
        />
      )}
    </Box>
  );
}

export default MaterialDataGrid;