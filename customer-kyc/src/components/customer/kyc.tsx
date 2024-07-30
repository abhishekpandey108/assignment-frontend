import { useState, useEffect } from "react";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import axios from "axios";
import CustomerList from "./CustomerList";
import { baseURL } from "../../utils/constant";

type FormValuesType = {
  firstName: string;
  lastName: string;
  profileImage: string;
  aadharImage: string;
  adminId: string;
};

interface FieldTypes {
  name: keyof FormValuesType;
  type: string;
  placeholder: string;
}

interface FileFieldTypes {
  name: keyof FormValuesType;
  label: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  aadharImage: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    secretAccessKey: "***********************************",
    accessKeyId: "************************************",
  },
});

const KYC = () => {

  const initialFormData: FormValuesType = {
    firstName: "",
    lastName: "",
    profileImage: "",
    aadharImage: "",
    adminId: "",
  };

  const [formData, setFormData] = useState<FormValuesType>(initialFormData);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getAllCustomers = async (): Promise<Customer[]> => {
    try {
      const response = await axios.get(`${baseURL}customer/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };

  const deleteCustomer = async(id: string) => {
    try {
          await axios.delete(`${baseURL}customer/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const updatedCustomer = customers.filter((customer) => customer.id !== id)
          setCustomers(updatedCustomer);
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof FormValuesType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true); 
      try {
        const fileKey = `docs/${file.name}-${Date.now()}`;
        const uploadCommand = new PutObjectCommand({
          Key: fileKey,
          Bucket: "abhishek-pandey",
          Body: file,
          ContentType: file.type,
        });

        await s3.send(uploadCommand);

        setFormData((prevData) => ({
          ...prevData,
          [name]: fileKey,
        }));
      } catch (error) {
        console.error("Error uploading file to S3:", error);
      } finally {
        setIsUploading(false); 
      }

    }
  };

  const renderFormField = (props: FieldTypes): JSX.Element => {
    const { name, type, placeholder } = props;
    return (
      <input
        className="w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none bg-custom-gray text-white focus:border-white"
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        value={formData[name]}
      />
    );
  };

  const handleFormSubmit = async () => {
    try {
      formData.adminId = localStorage.getItem("userId") || "";
      const response = await axios.post(
        "http://localhost:8000/customer/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData(initialFormData);
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      }
    } catch (error) {
      console.error("Customer creation error:", error);
    }
  };

  const renderFileFormField = (props: FileFieldTypes): JSX.Element => {
    const { name, label } = props;
    const isUploaded = formData[name];
    return (
      <div className="flex flex-col gap-2">
        <label className="text-white font-semibold">{label}</label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`dropzone-file-${name}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
              {isUploaded && (
                <div className="flex items-center mt-2">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-500 ml-2">Uploaded</span>
                </div>
              )}
            </div>
            <input
              id={`dropzone-file-${name}`}
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, name)}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-custom-dark overflow-scroll mt-20">
      <div className="flex flex-col items-end justify-start overflow-hidden mb-2 xl:max-w-3xl w-full">
        <div className="xl:max-w-3xl bg-black w-full p-5 sm:p-10 rounded-md">
          <h1 className="text-center text-xl sm:text-3xl font-semibold text-white">
            Customer Details
          </h1>
          <div className="w-full mt-8">
            <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {renderFormField({
                  name: "firstName",
                  type: "text",
                  placeholder: "Customer first name",
                })}
                {renderFormField({
                  name: "lastName",
                  type: "text",
                  placeholder: "Customer last name",
                })}
              </div>

              {renderFileFormField({
                name: "profileImage",
                label: "Profile Image",
              })}
              {renderFileFormField({
                name: "aadharImage",
                label: "Aadhar Image",
              })}
              <button
                className={`mt-5 tracking-wide font-semibold  ${isUploading ? 'bg-custom-orange/30' : 'bg-custom-orange'} bg-custom-orange text-gray-100 w-full py-4 rounded-lg hover:${isUploading ? 'bg-custom-orange/30' : 'bg-custom-orange/90'} transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                disabled={isUploading}
                onClick={handleFormSubmit}
              >
                <span className="ml-3">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
     {customers && <CustomerList customers={customers} loading={loading} deleteCustomer={deleteCustomer} />}
    </div>
  );
};

export default KYC;
