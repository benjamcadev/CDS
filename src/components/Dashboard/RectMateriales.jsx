import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import axios from '../../helpers/axios'
import {useEffect, useState} from 'react'

export default function RectMateriales() {

    const [totalMateriales, setTotalMateriales] = useState({total: 0})
    
      useEffect(() => {
    
        async function fetchTotalMateriales() {
          try {
            const response = await axios.get('materiales/total', { withCredentials: true });
           
            setTotalMateriales({
                ...totalMateriales,
                total: response.data[0].total
            })
          } catch (error) {
            console.error('Hubo un error fetch total materiales: ' + error);
          }
        }
    
        fetchTotalMateriales()
    
      }, [])

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent >
                <Stack spacing={3}>
                    <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography style={{ fontSize: '14px' }} color="#171717" variant="overline">
                                Materiales en Sistema
                            </Typography>
                            <Typography style={{ fontSize: '40px' }} variant="h4">{totalMateriales.total}</Typography>
                            <Typography variant="caption" >Materiales en total</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: '#4e36f5', height: '56px', width: '56px' }}>
                            <ListAltIcon style={{ color: 'white' }} />
                        </Avatar>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}