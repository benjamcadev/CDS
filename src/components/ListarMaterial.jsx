import React, { useEffect, useState, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getArticulos, searchArticulos } from '../helpers/getArticulos';
import { getBodegaMaterial } from '../helpers/getBodegas';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetailModal from './Modals/Detail.Modal';
import { Button } from '@mui/material';
import SearchBar from './UI/SearchBar';
import CreateModal from './Modals/Create.Modals';


export default function MaterialDataGrid() {
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
  const [searchValue, setSearchValue] = useState('');

  const fetchArticulos = async (currentPage, currentPageSize) => {
    try {
      setLoading(true);
      const data = await getArticulos(currentPage + 1, currentPageSize); // +1 porque la API espera un índice de página basado en 1
      const articulosConCantidad = await Promise.all(
        data.articulos.map(async (articulo) => {
          return { ...articulo, id: articulo.idarticulo };
        })
      );

      setArticulos(articulosConCantidad);
      setTotalArticulos(data.total_Articulos);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
      return;
    }
  
    try {
      setLoading(true);
      const data = await searchArticulos(searchValue);
  
      const articulosConCantidad = await Promise.all(
        data.map(async (articulo) => {
          return { ...articulo, id: articulo.id };
        })
      );

      // Filtrar duplicados en el frontend si aún se presentan
      const uniqueArticulos = [];
      const ids = new Set();
      for (const articulo of articulosConCantidad) {
          if (!ids.has(articulo.id)) {
              ids.add(articulo.id);
              uniqueArticulos.push(articulo);
          }
      }
  
      setArticulos(uniqueArticulos);
      setTotalArticulos(data.length);
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

  const handleDetailClick = (row) => {
    setSelectedArticulo(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArticulo(null);
  };

  const rowCount = useMemo(() => {
    if (totalArticulos !== undefined) {
      rowCountRef.current = totalArticulos;
    }
    return rowCountRef.current;
  }, [totalArticulos]);

    // Define la función handleSave que se pasará a CreateModal
    const handleSave = () => {
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
    };

    const handleUpdate = () => {
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
    }

    const handleDelete = () => {
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
    }

  const columns = [
    { field: 'id', headerAlign:'center', headerName: 'ID', align: 'center', width: 85 },
    { field: 'Descripcion', headerName: 'Descripción', width: 450 },
    { field: 'Codigo_SAP', headerName: 'SAP', headerAlign: 'center', width: 150, align: 'center' },
    { field: 'Codigo_interno', headerName: 'Código Interno', headerAlign: 'center', width: 150, align: 'center' },
    { field: 'unidad_medida', headerName: 'Unidad de Medida', width: 150, align: 'center' },
    { field: 'precio', headerName: 'Precio', headerAlign: 'center', type: 'number', width: 150, align: 'center' },
    {
      field: 'Detalle',
      headerName: 'Detalle Articulo',
      width: 140,
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
      <div className='flex justify-between items-center mb-4'>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onEnter={handleSearch}
        />
        <CreateModal name={'Crear Articulo'} title={'Crear Articulo'} onSave={ handleSave }  />
      </div>
      <DataGrid
        rows={articulos}
        columns={columns}
        getRowId={(row) => row.id}
        rowCount={rowCount}
        loading={loading}
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
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}