import {useState} from 'react';
import { Card, Avatar, Button,Space,notification, App } from 'antd';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
const close = () => {
    console.log(
        'Closed the notification.',
    );

};

const detectCardType = (cardNumber) => {
    const firstDigit = cardNumber[0];
    const firstTwoDigits = parseInt(cardNumber.slice(0, 2), 10);
    const firstFourDigits = parseInt(cardNumber.slice(0, 4), 10);

    if (firstDigit === '4') {
        return {
            type: 'visa',
            backgroundColor: '#af8843'
        };
    } else if (firstTwoDigits >= 51 && firstTwoDigits <= 55) {
        return {
            type: 'mastercard',
            backgroundColor: '#FF8C00'
        };
    } else if ((firstTwoDigits === 34 || firstTwoDigits === 37) || (firstFourDigits >= 2221 && firstFourDigits <= 2720)) {
        return {
            type: 'american-express',
            backgroundColor: '#00448a'
        };
    } else {
        return {
            type: 'unknown',
            backgroundColor: 'gray'
        };
    }
};

const CreditCard = ({ id, number, alias, cvc,openNotification, onEditClick , wasDeleted}) => {

    const [showNotification, setShowNotification] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const [enableDelete, setEnableDelete] = useState(false);
    let isPossibleDelete = false;
    const handleDelete = () => {
        isPossibleDelete = true;
        console.log('handleDelete');
        console.log('enableDelete :',enableDelete);
        if (isPossibleDelete){
            console.log('handleDelete 2');

            setEnableDelete(false);
            deleteCard(id);
            isPossibleDelete = false;

        }

    };

    const handleCancel = () => {
        isPossibleDelete = false;
        setEnableDelete(false);
        setShowNotification(false);
    };

    const handleUndo = () => {
       setEnableDelete(false);

    };


    const openNotification2 = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="primary" size="small" onClick={() => {
                    api.destroy(this, key);
                    handleCancel();
                }}>
                    Undo delete
                </Button>
            </Space>
        );
        api.open({
            placement: 'bottomLeft',
            bottom: 50,
            message: 'Delete Credit Card - '+alias,
            description:
                'Cancel delete this card?',
            btn,
            key,
            onClose: handleDelete,
        });
    };


    const cardTypeInfo = detectCardType(number);

    const deleteCard = async (creditCardId) => {
        try {
            // Make a DELETE request to the API endpoint
            console.log("creditCardId", creditCardId);
            let response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/creditCards/${creditCardId}`,
                {
                    method: "DELETE",
                    headers: {
                        "apikey": localStorage.getItem("apiKey")
                    }
                }
            );
            console.log("response", response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            wasDeleted(false);
            openNotification("top", "Credit Card deleted", "success");

            console.log('Tarjeta de crédito eliminada con éxito.');

        } catch (error) {
            console.error('Error al eliminar la tarjeta de crédito:', error);
            openNotification("top", error, "error");
        }
    };


    return (
        <div style={{
            background: cardTypeInfo.backgroundColor,
            borderRadius: '8px',
            padding: '20px',
            color: 'white',

            width: '100%',
            position: 'relative',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>

            <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>


                <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    size="small"
                    style={{
                        border: 'none',
                        color: 'white',
                        backgroundColor: 'transparent'
                    }}
                    onClick={onEditClick}
                />
                <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{
                        border: 'none',
                        color: 'white',
                        backgroundColor: 'transparent'
                    }}
                    onClick={openNotification2} // Add your delete click handler here
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <Avatar src={`./${cardTypeInfo.type}.png`} />
            </div>
            <div style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                {number}
            </div>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{ fontSize: '.9rem', fontWeight:"bold",textTransform:"uppercase", opacity: 0.8 }}>
                    {alias}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8, display:"flex",flexDirection:"column", alignItems:"center" }}>
                    CVC <div>{cvc}</div>
                </div>
            </div>
            {contextHolder}
        </div>
    );
};

export default CreditCard;
