import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import axios from '../../helpers/axios'
import { useEffect, useState } from 'react'

//Iconos de react-icons
import { FaFileArrowUp } from "react-icons/fa6";


export default function RectValeEntrada() {


    const [totalValesEntrada, setTotalValesEntrada] = useState({ total: 0 })

    useEffect(() => {

        async function fetchTotalValesEntrada() {
            try {
                const response = await axios.get('ticket/entrada-total', { withCredentials: true });

                setTotalValesEntrada({
                    ...totalValesEntrada,
                    total: response.data[0].total
                })
            } catch (error) {
                console.error('Hubo un error fetch total vales entrada: ' + error);
            }
        }

        fetchTotalValesEntrada()

    }, [])

    const getCurrentMonthName = () => {
        const options = { month: 'long' }; // 'long' para el nombre completo del mes
        const monthName = new Date().toLocaleString('es-ES', options); // Cambia 'es-ES' si prefieres otro idioma
        return monthName;
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent >
                <Stack spacing={3}>
                    <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
                        <Stack spacing={1}>
                            <Typography style={{ fontSize: '14px' }} color="#171717" variant="overline">
                                Vales de Entrada Mensuales
                            </Typography>
                            <Typography style={{ fontSize: '40px' }} variant="h4">{totalValesEntrada.total}</Typography>
                            <Typography variant="caption" >Vales al mes de {getCurrentMonthName()}</Typography>
                        </Stack>
                        <Avatar sx={{ backgroundColor: '#fcb036', height: '56px', width: '56px' }}>
                            <FaFileArrowUp style={{ color: 'white' }} />
                        </Avatar>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}