import React from 'react';
import OpenInNewTab from "../../assets/openInNewTab.svg";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './kyc'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Customer } from './kyc'

interface CustomersListProps {
  customers: Customer[];
  loading: boolean;
  deleteCustomer: (id: string) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, loading, deleteCustomer }) => {
  const adminId = localStorage.getItem("userId");

  const viewImage = async(key: string) => {
    const getURlCommand = new GetObjectCommand ({
      Bucket: 'abhishek-pandey',
      Key: key,
    });
    const response = await getSignedUrl(s3, getURlCommand, { expiresIn: 15 * 60 * 60 });
    window.open(response, '_blank');
    console.log("here we have response now ", response);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-custom-dark text-white">
      <h1 className="text-2xl font-bold mb-4">Customers List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-custom-gray border border-gray-700 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border border-gray-700">First Name</th>
              <th className="py-2 px-4 border border-gray-700">Last Name</th>
              <th className="py-2 px-4 border border-gray-700">Profile Image</th>
              <th className="py-2 px-4 border border-gray-700">Aadhar Image</th>
              <th className="py-2 px-4 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="bg-custom-gray hover:bg-custom-light-gray">
                <td className="py-2 px-4 border border-gray-700">{customer.firstName}</td>
                <td className="py-2 px-4 border border-gray-700">{customer.lastName}</td>
                <td className="py-2 px-4 border border-gray-700">
                  <img src={OpenInNewTab} alt="Profile" className="w-10 h-10 cursor-pointer" onClick={() => viewImage(customer?.profileImage)} />
                </td>
                <td className="py-2 px-4 border border-gray-700">
                  <img src={OpenInNewTab} alt="Aadhar" className="w-10 h-10 cursor-pointer" onClick={() => viewImage(customer?.aadharImage)} />
                </td>
                <td className="py-2 px-4 border border-gray-700">
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    disabled={adminId !== customer.adminId}
                    className={`text-red-500 hover:text-red-700 ${adminId !== customer.adminId ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
