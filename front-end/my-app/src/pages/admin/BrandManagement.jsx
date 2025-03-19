import React, { useState, useEffect } from "react";
import { getBrands, createBrand } from "../../services/brandService";
import { Button, Table, Form, Container, Row, Col, Card } from "react-bootstrap";

export const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        const data = await getBrands();
        setBrands(data.data);
    };

    const handleAddBrand = async () => {
        if (!name || !description) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        await createBrand({ name, description });
        setName("");
        setDescription("");
        loadBrands();
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm p-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                        <h2 className="text-center text-primary">Quản lý thương hiệu</h2>
                        <Form className="mt-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Tên thương hiệu</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập tên thương hiệu"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Mô tả</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhập mô tả thương hiệu"
                                />
                            </Form.Group>

                            <Button variant="success" onClick={handleAddBrand} className="w-100">
                                Thêm thương hiệu
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h3 className="text-center text-primary">Danh sách thương hiệu</h3>
                    <Table striped bordered hover className="shadow-sm mt-3">
                        <thead className="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Tên thương hiệu</th>
                            <th>Mô tả</th>
                        </tr>
                        </thead>
                        <tbody>
                        {brands.map((brand, index) => (
                            <tr key={brand._id}>
                                <td>{index + 1}</td>
                                <td className="fw-bold">{brand.name}</td>
                                <td>{brand.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
