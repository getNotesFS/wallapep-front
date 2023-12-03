import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

import {modifyStateProperty} from "../../Utils/UtilsState";
import {Upload, Button, Row, Col, Card, Form, Input, Select, Image, message} from 'antd';
import {InboxOutlined, DollarOutlined} from '@ant-design/icons';

import {useSelector, useDispatch} from "react-redux";
import {actions} from "../../Reducers/reducerCountSlice";
import category_options from "../../data/categories";
import {
    requiredValidator,
    rangeValidator,
    isFormValid,
    allowSubmitForm,
    setServerErrors,
    setServerErrorsByField,
    joinAllServerErrorMessages,
    getValidateStatus,
    priceValidator
} from '../../Utils/UtilsValidations';

import useValidation from '../../hooks/useFormValidation';

const {Dragger} = Upload;

const {Option} = Select;


const validators = {
    title: [requiredValidator(),
        value => rangeValidator(value, 0, 100, "Title must be max 100 characters")],
    description: [requiredValidator(),
        value => rangeValidator(value, 0, 1000, "Description must be max 1000 characters")],
    price: [priceValidator(),
        value => rangeValidator(value, 0, 100000, "Price must be max 100000")],
    category: [requiredValidator()],


};
let CreateProductComponent = (props2) => {

    let {openNotification} = props2;

    const [form] = Form.useForm();

    let requiredInForm = ["title", "description", "price", "category"];

    const initialFormData = {
        title: '',
        description: '',
        price: '',
        category: '',
        image: '',

    };

    const {
        formData,
        setFormData,
        handleChange,
        formErrors,
        setFormErrors,
        touchedFields,
        setTouchedFields
    } = useValidation(initialFormData, validators);

    const countGlobalState1 = useSelector(state => state.reducerCount);
    const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();
    const onSearch = (val) => {
        console.log('search:', val);
    };
    let [fileList, setFileList] = useState([]);


    const resetForm = () => {
        form.resetFields(); // Resetear campos del formulario de Ant Design
        setFormData(initialFormData); // Resetear el estado del formulario
        setFormErrors({}); // Resetear los errores del formulario
        setTouchedFields({}); // Resetear los campos tocados
        setFileList([]); // Resetear la lista de archivos
    };
    let clickCreateProduct = async () => {

        let tmp_formData = {...formData};
        let unique_file_name = "";
        if (formData.image && formData.image instanceof File) {
            tmp_formData.image = formData.image.name;

            let extension = formData.image.name.split('.').pop();
            let uniqueName = `${Date.now()}-${uuidv4()}.${extension}`;
            unique_file_name = uniqueName;
            tmp_formData.image = uniqueName;

        } else {
            tmp_formData.image = null;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(tmp_formData)
            })

        if (response.ok) {
            let data = await response.json();
            //let image_name = data.productId+unique_file_name;
            let image_name = unique_file_name;
            if (formData.image && requiredInForm.includes("image")) {
                await uploadImage(data.productId,image_name);
                openNotification("top", "New product created successfully", "success");
            } else if (!requiredInForm.includes("image") && formData.image) {
                await uploadImage(data.productId,image_name);
                openNotification("top", "New product created successfully", "success");

            } else if (!requiredInForm.includes("image")) {
                // If image is not required, you can directly show success notification
                openNotification("top", "New product created successfully", "success");
            }
            resetForm();
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })

            setServerErrors(serverErrors, setFormErrors);
            openNotification("top", joinAllServerErrorMessages(serverErrors), "error");

        }
    }

    let uploadImage = async (productId,unique_name) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);
        formDataPhotos.append('unique_name', unique_name);


        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId + "/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            })
        if (response.ok) {
            openNotification("top", "Image upliaded successfully", "success");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }

    }


    const onUploadChange = info => {

        // verificar tipo de archivo
        const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png' || info.file.type === 'image/jpg';
        // Si el archivo no es JPG o PNG, mostrar un mensaje de error
        if (!isJpgOrPng) {
            handleChange('image', null);
            message.error('You can only upload JPEG/JPG/PNG file!');

        }

        let newFileList = [...info.fileList];
        // Generar la vista previa de la imagen
        newFileList = newFileList.map(file => {
            if (file.response && file.response.url) {
                // Componente Upload maneja internamente la propiedad `url`
                file.url = file.response.url;

            }

            return file;
        });
        if (newFileList.length > 0) {
            handleChange('image', info.file);
        } else {
            handleChange('image', null);
        }
        setFileList(newFileList);

    };

    const handleFieldTouched = (field) => {
        setTouchedFields(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const props = {
        // ... (resto de tus props),
        beforeUpload: file => {
            const reader = new FileReader();
            reader.onload = e => {
                file.thumbUrl = e.target.result;
                setFileList([file]);
            };
            reader.readAsDataURL(file);
            // Evitar que Upload suba automáticamente
            return false;
        },
        onChange: onUploadChange,
        fileList,
    };

    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        // Lógica para determinar si el formulario es válido
        const isValid = isFormValid(formData, formErrors, requiredInForm);
        setFormValid(isValid);
    }, [formData, formErrors]);


    return (
        <div style={{padding: "20px 50px"}}>


            <Row align="stretch"
                 justify="center" style={{minHeight: "70vh", alignItems: "center"}}>

                {fileList.length > 0 && (
                    <Col flex="auto" style={{
                        backgroundColor: "#ffffff",
                        padding: 10,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Image style={{
                            height: "100%",
                            minWidth: 200,
                            minHeight: 200,
                            maxWidth: 300,
                            objectFit: "contain",
                            borderRadius: 5
                        }} src={fileList[0].thumbUrl || fileList[0].url}/>
                    </Col>
                )}
                <Col flex={fileList.length > 0 ? "auto" : ""}>
                    <Card title="Create product" style={{width: "500px", height: "100%"}}>


                        <Form size={"large"} form={form}>
                            <Form.Item
                                label=""
                                hasFeedback
                                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "price")}
                                help={touchedFields.price && formErrors.price ? formErrors.price.msg : null}
                            >
                                <Input
                                    style={{width: "10rem"}}
                                    size="large"
                                    type="number"
                                    min={0}

                                    prefix={<DollarOutlined/>}
                                    placeholder=" price"
                                    value={formData.price || ''}
                                    onChange={(e) => {
                                        handleChange('price', e.target.value);
                                        handleFieldTouched('price');
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                hasFeedback
                                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "title")}
                                help={touchedFields.title && formErrors.title ? formErrors.title.msg : null}
                            >
                                <Input
                                    size="large"
                                    type="text"
                                    placeholder="product title"
                                    value={formData.title || ''}
                                    onChange={(e) => {
                                        handleChange('title', e.target.value);
                                        handleFieldTouched('title');
                                    }}
                                />
                            </Form.Item>


                            <Form.Item
                                label=""
                                hasFeedback
                                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "category")}
                                help={touchedFields.category && formErrors.category ? formErrors.category.msg : null}
                            >
                                <Select
                                    showSearch
                                    onSearch={onSearch}
                                    placeholder="Select a category"
                                    onChange={(value) => {
                                        handleChange('category', value);
                                        handleFieldTouched('category');
                                    }}
                                    value={formData.category || 'Select a category'}
                                >
                                    {category_options.map(category => (
                                        <Option key={category} value={category}>{category}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label=""
                                hasFeedback
                                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "description")}
                                help={touchedFields.description && formErrors.description ? formErrors.description.msg : null}
                            >
                                <Input.TextArea
                                    rows={4}
                                    size="large"
                                    type="text"
                                    placeholder="product description"
                                    value={formData.description || ''}
                                    onChange={(e) => {
                                        handleChange('description', e.target.value);
                                        handleFieldTouched('description');
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label=""
                                hasFeedback
                                validateStatus={getValidateStatus(formData, formErrors, touchedFields, "image")}
                                help={touchedFields.image && formErrors.image ? formErrors.image.msg : null}
                            >
                                <Dragger {...props} onChange={onUploadChange} fileList={fileList}
                                         accept=".jpg, .jpeg, .png">
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined/>
                                    </p>
                                    <p className="ant-upload-text">Click or drag image to this area to upload</p>
                                </Dragger>
                            </Form.Item>


                            <Button type="primary" block disabled={!formValid} onClick={clickCreateProduct}>
                                Sell Product
                            </Button>
                        </Form>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default CreateProductComponent;