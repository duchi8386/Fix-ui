import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [page, statusFilter]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/users?page=${page}&limit=${limit}&status=${statusFilter}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setUsers(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const handleStatusChange = async (userId, status) => {
        try {
            await axios.put(`http://localhost:9999/users/${userId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            fetchUsers();
        } catch (error) {
            console.error("Error updating user status", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            <Form.Group controlId="statusFilter">
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </Form.Select>
            </Form.Group>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>FullName</th>
                    <th>Status</th>
                    <th>PhoneNumber</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.email}</td>
                        <td>{user.fullName}</td>
                        <td>
                            <Form.Select
                                value={user.status}
                                onChange={(e) => handleStatusChange(user._id, e.target.value)}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </Form.Select>
                        </td>
                        <td>{user.phoneNumber}</td>

                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="pagination-controls">
                <Button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span className="mx-2">Page {page} of {totalPages}</span>
                <Button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default UserManagement;