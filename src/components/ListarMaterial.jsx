import { useEffect, useState, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getArticulos, searchArticulos } from '../helpers/getArticulos';
//import { getBodegaMaterial } from '../helpers/getBodegas';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import DetailModal from './Modals/Detail.Modal';
import KardexModal from './Modals/Kardex.Modal';
import { Button } from '@mui/material';
import SearchBar from './UI/SearchBar';
import CreateModal from './Modals/Create.Modals';
import { useAuth } from '../context/AuthContext';



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
  const [selectedArticuloKardex, setSelectedArticuloKardex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKardexOpen, setModalKardexOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const fetchArticulos = async (currentPage, currentPageSize) => {
    
    try {
      setLoading(true);
      setError(null);
      const data = await getArticulos(currentPage + 1, currentPageSize);
      const articulosConCantidad = data.articulos.map((articulo) => ({
        ...articulo,
        id: articulo.idarticulo,
      }));

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
      setIsSearching(false);
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchArticulos(searchValue);
      const articulosConCantidad = data.map((articulo) => ({
        ...articulo,
        id: articulo.id,
      }));

     

      // Filtrar duplicados
      const uniqueArticulos = articulosConCantidad.filter(
        (articulo, index, self) =>
          index === self.findIndex((t) => t.id === articulo.id)
      );

      if (uniqueArticulos.length === 0) {
        setIsSearching(false);
        setSearchValue('');
        fetchArticulos(paginationModel.page, paginationModel.pageSize);
      } else {
        setArticulos(uniqueArticulos);
        setTotalArticulos(uniqueArticulos.length);
        setIsSearching(true);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isSearching) {
      handleSearch();
    } else {
      fetchArticulos(paginationModel.page, paginationModel.pageSize);
    }
  }, [paginationModel, isSearching]);

  const rowCountRef = useRef(totalArticulos);

  useEffect(() => {
    
  }, [selectedArticuloKardex, KardexModal])

  const handleDetailClick = (row) => {
    setSelectedArticulo(row);
    setModalOpen(true);
  };

  const handleKardexClick = (row) => {
    setSelectedArticuloKardex(row);
    setModalKardexOpen(true);
  };

  const handleCloseModalKardex = () => {
    setModalKardexOpen(false);
    setSelectedArticuloKardex(null);
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

  const handleSave = () => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    fetchArticulos(0, paginationModel.pageSize);
  };

  const handleUpdate = () => {
    fetchArticulos(paginationModel.page, paginationModel.pageSize);
  };

  const handleDelete = () => {
    fetchArticulos(paginationModel.page, paginationModel.pageSize);
  };

  const columns = [
    { field: 'id', headerAlign: 'center', headerName: 'ID', align: 'center', width: 70 },
    { field: 'Descripcion', headerName: 'Descripción', width: 450 },
    { field: 'Codigo_SAP', headerName: 'SAP', headerAlign: 'left', width: 120, align: 'left' },
    { field: 'Codigo_interno', headerName: 'Código Interno', headerAlign: 'left', width: 120, align: 'left' },
    { field: 'unidad_medida', headerName: 'Unidad Medida', headerAlign: 'left', width: 130, align: 'left' },
    { field: 'precio', headerName: 'Precio', headerAlign: 'left', type: 'number', width: 90, align: 'left' },
    { field: 'cantidad_min', headerName: 'Min Stock', headerAlign: 'left', type: 'number', width: 80, align: 'left' },
    {
      field: 'Detalle',
      headerName: 'Detalle',
      width: 85,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Button
          color="warning"
          startIcon={<VisibilityIcon />}
          onClick={() => handleDetailClick(params.row)}
        >
        </Button>


      ),
    },
    {
      field: 'kardex',
      headerName: 'Kardex',
      width: 85,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Box textAlign='left'>
          <Button
            color="primary"
            startIcon={<DescriptionIcon />}
            onClick={() => handleKardexClick(params.row)}
          >
          </Button>
        </Box>



      ),
    },

  ];

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <div className='flex justify-between items-center mb-4'>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onEnter={handleSearch}
        />
        {user.tipoUser === 1
          ? (<CreateModal name={'Crear Articulo'} title={'Crear Articulo'} onSave={handleSave} />)
          : (<div></div>)
        }
      </div>
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 3 }}>
          <p>Material No Existe En la Base de datos</p>
          <Button sx={{ mt: 2 }} color='primary' variant='contained' onClick={() => fetchArticulos(paginationModel.page, paginationModel.pageSize)}>
            Recargue la Tabla
          </Button>
        </Box>
      )}
      {!error && (
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
      )}
      {selectedArticulo && (
        <DetailModal
          open={modalOpen}
          handleClose={handleCloseModal}
          article={selectedArticulo}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {selectedArticuloKardex && (
        <KardexModal
          open={modalKardexOpen}
          handleClose={handleCloseModalKardex}
          article={selectedArticuloKardex}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}