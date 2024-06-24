import React, { useEffect, useState } from 'react';
import './Notifications.css';
import Layouts from '../Layouts/Layouts';
import { Tabs, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../../redux/userSlice';
import moment from 'moment';

const Notifications = () => {
    document.title = "Notification"
    const { user } = useSelector((state) => state.user);
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const markAllSeen = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/mark-all-notification-as-seen', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('something is wrong');
        }
    };

    const deleteAll = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/delete-all-notifications', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('something is wrong');
        }
    };

    const fetchReservations = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/user/reservations', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setReservations(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('something is wrong');
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const columns = [
        { title: 'Nom', dataIndex: 'Name', key: 'Name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'NTele', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Address', dataIndex: 'adress', key: 'adress' },
        { title: 'Timing', dataIndex: 'timing', key: 'timing' },
    ];

    const dataSource = reservations.map(reservation => {
        const formattedTimingDebut = moment(reservation.timings[0]).format('YYYY-MM-DD HH:mm');
        const formattedTimingFin = moment(reservation.timings[1]).format('YYYY-MM-DD HH:mm');
        return {
            key: reservation._id,
            Name: reservation.Name,
            email: reservation.email,
            phoneNumber: reservation.phoneNumber,
            adress: reservation.adress,
            timing: `Du ${formattedTimingDebut} à ${formattedTimingFin}`,
        };
    });

    return (
        <Layouts>
            <h1 className='page-title'>Notifications</h1>
            <Tabs>
                <Tabs.TabPane tab="Invisible" key="0">
                    <div className="d-flex justify-content-end">
                        <h1 className="text-notification" onClick={markAllSeen}>
                            Marquer comme tout vu
                        </h1>
                    </div>
                    <div className="class">
                        <Table dataSource={dataSource} columns={columns} />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Vu" key="1">
                    <div className="d-flex justify-content-end">
                        <h1 className="text-notification" onClick={deleteAll}>
                            Supprimer tout
                        </h1>
                    </div>
                    {user?.seenNotifications.map((notification) => (
                        <div className='card p-2' onClick={() => navigate(notification.onClickPath)} key={notification._id}>
                            <div className="card-text">{notification.message}</div>
                        </div>
                    ))}
                </Tabs.TabPane>
            </Tabs>
        </Layouts>
    );
};

export default Notifications;
