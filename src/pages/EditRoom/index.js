import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Button from '~/components/Button/Button';
import Toast from '~/components/Toast/Toast';
import * as roomManagerService from '~/services/roomManagerService';

import styles from './EditRoom.module.scss';

const cx = classNames.bind(styles);

function EditRoom() {
    const { id } = useParams();

    const [tenPhong, setTenPhong] = useState('');
    const [toaNha, setToaNha] = useState('');
    const [soLuongMax, setSoLuongMax] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [errorValue1, setErrorValue1] = useState(false);
    const [errorValue2, setErrorValue2] = useState(false);
    const [errorValue3, setErrorValue3] = useState(false);

    const handleTenPhongChange = (event) => {
        setTenPhong(event.target.value);
    };

    const handleToaNhaChange = (event) => {
        setToaNha(event.target.value);
    };

    const handleSoLuongMaxChange = (event) => {
        setSoLuongMax(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = {
            id: id,
            tenPhong: tenPhong,
            toaNha: toaNha,
            soLuongMax: soLuongMax,
        };

        if (tenPhong !== '' && toaNha !== '' && soLuongMax !== '') {
            try {
                await roomManagerService.put(id, data);
            } catch (error) {
                console.error(error);
            }
            setMessage('Lưu thông tin phòng thành công');
        } else {
            if (tenPhong === '') setErrorValue1(true);
            if (toaNha === '') setErrorValue2(true);
            if (soLuongMax === '') setErrorValue3(true);
            setMessage('Các trường chưa nhập đầy đủ thông tin');
            setError(true);
        }
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    useEffect(() => {
        const fetchApi = async () => {
            const result = await roomManagerService.edit(id);
            setTenPhong(result.tenPhong);
            setToaNha(result.toaNha);
            setSoLuongMax(result.soLuongMax);
        };

        fetchApi();
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            {!!message && !error && <Toast message={message} success />}
            {!!message && error && <Toast message={message} error />}
            <div className={cx('div-input', 'gird')}>
                <label htmlFor="ten-phong">Tên phòng</label>
                {errorValue1 && <span className={cx('error')}>*Tên phòng là bắt buộc</span>}
                <input
                    id="ten-phong"
                    className={errorValue1 ? cx('error-input') : cx('input')}
                    type="text"
                    value={tenPhong}
                    onChange={handleTenPhongChange}
                />
            </div>
            <div className={cx('div-input', 'gird')}>
                <label htmlFor="toa-nha">Tên tòa nhà</label>
                {errorValue2 && <span className={cx('error')}>*Tên tòa nhà là bắt buộc</span>}
                <input
                    id="toa-nha"
                    className={errorValue2 ? cx('error-input') : cx('input')}
                    type="text"
                    value={toaNha}
                    onChange={handleToaNhaChange}
                />
            </div>
            <div className={cx('div-input', 'gird')}>
                <label htmlFor="so-luong">Số lượng tối đa sinh viên</label>
                {errorValue3 && (
                    <span className={cx('error')}>*Số lượng tối đa sinh viên là bắt buộc và phải là 1 số</span>
                )}
                <input
                    id="so-luong"
                    className={errorValue3 ? cx('error-input') : cx('input')}
                    type="number"
                    value={soLuongMax}
                    onChange={handleSoLuongMaxChange}
                />
            </div>
            <Button success onClick={handleFormSubmit}>
                Lưu
            </Button>
        </div>
    );
}

export default EditRoom;
