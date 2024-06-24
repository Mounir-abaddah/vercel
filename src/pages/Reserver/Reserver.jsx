import React, { useState } from 'react';
import { Input, Row, Col, Form, TimePicker, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Layouts from '../../Components/Layouts/Layouts';
import moment from 'moment';
import { showLoading,hideLoading } from '../../redux/alertsSlice';
import './Reserver.css'

const Reserver = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(null);

  const onFinish = async (values) => {
    if (selectedTime && selectedTime.length === 2) {
      const duration = moment.duration(selectedTime[1].diff(selectedTime[0])).asHours();
      if (duration !== 1) {
        toast.error('Veuillez sélectionner une plage horaire d\'une heure.');
        return;
      }

      try {
        dispatch(showLoading());
        const response = await axios.post('/api/user/reservation', { ...values, userId: user._id, timings: selectedTime }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/Dashboard');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        toast.error('Quelque chose s\'est mal passé.');
      }
    } else {
      toast.error('Vous devez sélectionner une plage horaire.');
    }
  };

  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 8 || i > 20) {
        hours.push(i);
      }
    }
    return hours;
  };

  const disabledMinutes = (selectedHour) => {
    if (selectedTime && selectedTime.length === 1 && selectedTime[0].hour() === selectedHour) {
      return Array.from({ length: 60 }, (_, i) => (i !== 0 ? i : null)).filter(i => i !== null);
    }
    return [];
  };

  const onTimeChange = (times) => {
    setSelectedTime(times);
  };

  const disabledRange = (current) => {
    if (!selectedTime || selectedTime.length === 0) {
      return false;
    }
    const startHour = selectedTime[0].hour();
    return current.hour() !== startHour + 1 || current.minute() !== 0;
  };

  return (
    <Layouts>
      <h1 className='text-2xl font-bold mb-4'>Postulation du terrain:</h1>
      <hr className='mb-4' />
      <Form layout='vertical' onFinish={onFinish} className='reserver mt-8'>
        <Row gutter={16} className='gg'>
          <Col span={12}>
            <Form.Item label='Nom' name='Name' rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}>
              <Input placeholder='Entrez votre nom' className='Input'/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Numéro de téléphone' name='phoneNumber' rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}>
              <Input placeholder='Entrez votre numéro de téléphone' type='tel' maxLength={10} className='Input'/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} className='gg'>
          <Col span={12}>
            <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Veuillez entrer votre email' }]}>
              <Input placeholder='Entrez votre email' type='email' className='Input'/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Adresse' name='adress' rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}>
              <Input placeholder='Entrez votre adresse' className='Input'/>
            </Form.Item>
          </Col>
        </Row>
        <Row className='gg'>
          <Col span={24}>
            <Form.Item label='Horaire' name='timings' rules={[{ required: true, message: 'Veuillez sélectionner une heure' }]}>
              <TimePicker.RangePicker
              className='Input'
                format='HH:mm'
                minuteStep={60}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
                hideDisabledOptions
                onChange={onTimeChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className='gg'>
          <Button type='primary' htmlType='submit' className='bg-indigo-800 text-slate-200 pt-2 pb-2 pr-4 py-4 h-10'>
            Soumettre
          </Button>
        </Form.Item>
      </Form>
    </Layouts>
  );
};

export default Reserver;
