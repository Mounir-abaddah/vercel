import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import toast from 'react-hot-toast';
import Layouts from '../../Components/Layouts/Layouts';
import { Card, Col, Row, Button } from 'antd';
import './Rendezvous.css'

const Rendezvous = () => {
    const [reservations, setReservations] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    console.log(user);

    const fetchReservations = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/user/reservations', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setReservations(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Erreur lors de la récupération des réservations");
        }
    };

    const deleteAllReservations = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.delete('/api/user/delete-all-reservations', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: { userId: user._id }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setReservations([]); // Clear local state
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Erreur lors de la suppression des réservations");
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <Layouts>
            <h1 className='page-title'>Mes Réservations</h1>
            <hr />
            <div className="buttons-delete flex justify-end items-end mt-2">
            <Button type="primary" danger onClick={deleteAllReservations}>
                Supprimer toutes les réservations
            </Button>
            </div>

            <Row gutter={16} className='row'>
                {reservations.map(reservation => (
                    <Col span={8} key={reservation._id} className='tt'>
                        <Card title={`${reservation.Name}`} bordered={false} className='tt'>
                            <p><strong>Téléphone:</strong> {reservation.phoneNumber}</p>
                            <p><strong>Email:</strong> {reservation.email}</p>
                            <p><strong>Adresse:</strong> {reservation.adress}</p>
                            <p><strong>Horaires:</strong> {reservation.timings.map(time => new Date(time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })).join(' - ')}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Layouts>
    );
};

export default Rendezvous;
