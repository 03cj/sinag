import React, { useState, useEffect } from 'react';

const HomeI = () => {
    // --- Placeholder Data (Replace with actual API calls from your database/backend) ---
    const [internData, setInternData] = useState({
        firstName: 'Juan', // Example intern name
        status: 'Documents Pending', // Example status
        profileCompleted: true,
        documentsPending: true,
        awaitingApproval: false,
        internshipOngoing: false,
        documents: [
            { name: 'Medical Certificate', uploaded: false, file: null, remarks: 'Please ensure the certificate is signed by a licensed physician.' },
            { name: 'Resume / CV', uploaded: true, file: 'resume_cv.pdf', remarks: 'Your OJT Coordinator approved your resume.' },
            { name: 'Insurance', uploaded: false, file: null, remarks: 'Kindly upload your insurance policy before the internship start date.' },
            // Add more documents as needed, following the format
        ],
        companyDetails: {
            companyName: 'XYZ Corp',
            supervisor: 'Jane Doe',
            startDate: 'July 1, 2025',
            endDate: 'September 30, 2025',
            hoursRequired: 300,
            currentHours: 150, // Example
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- New State for managing the right box content ---
    const [activeView, setActiveView] = useState('status'); // Default to 'status'

    // useEffect Hook: Used for fetching initial data from the database/backend
    useEffect(() => {
        const fetchInternDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- DATABASE/BACKEND INTERACTION POINT 1: Fetching Data ---
                // Replace this simulated delay with an actual API call to your backend.
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch intern data:", err);
                setError("Failed to load dashboard data. Please try again.");
                setLoading(false);
            }
        };

        fetchInternDashboardData();
    }, []); // Empty dependency array means this runs once on component mount

    // --- Helper to determine status color ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'Profile Completed':
                return 'bg-green-500';
            case 'Documents Pending':
                return 'bg-yellow-500';
            case 'Awaiting Approval':
                return 'bg-red-500';
            case 'Internship Ongoing':
            case 'Completed':
                return 'bg-blue-500'; // Or another color for ongoing/completed
            default:
                return 'bg-gray-500';
        }
    };

    // --- File View Handler ---
    const handleFileView = (fileName) => {
        alert(`Viewing file: ${fileName}`);
        window.open(`/api/documents/${fileName}`, '_blank'); // Example path to a backend endpoint
    };


    // --- New Function to render the content for the right box ---
    const renderRightBoxContent = () => {
        if (activeView === 'status') {
            return (
                <div>
                    <h4 className="text-lg font-bold mb-2">Current Status:</h4>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${getStatusColor(internData.status)}`}>
                            {internData.status}
                        </span>
                        <p className="text-gray-600">
                            {internData.status === 'Documents Pending'
                                ? "You have pending documents to submit."
                                : internData.status === 'Awaiting Approval'
                                    ? "Your application is under review by the coordinator."
                                    : "You are all set to go!"}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h5 className="font-semibold text-gray-800">Documents Status:</h5>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                            {internData.documents.map((doc, index) => (
                                <li key={index} className="text-sm">
                                    <span className="font-medium">{doc.name}:</span>
                                    {' '}
                                    <span className={doc.uploaded ? 'text-green-600' : 'text-red-600'}>
                                        {doc.uploaded ? 'Uploaded' : 'Pending'}
                                    </span>
                                    {doc.uploaded && (
                                        <button
                                            onClick={() => handleFileView(doc.file)}
                                            className="ml-2 text-blue-500 hover:text-blue-700 underline"
                                        >
                                            View
                                        </button>
                                    )}
                                    {doc.remarks && <p className="text-gray-500 text-xs italic mt-1">{doc.remarks}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        } else if (activeView === 'inbox') {
            return (
                <div>
                    <h4 className="text-lg font-bold mb-2">Inbox Messages:</h4>
                    {/* Placeholder for inbox messages. You'd fetch and map these from your database */}
                    <div className="space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <p className="font-semibold text-gray-800">Message from Coordinator</p>
                            <p className="text-sm text-gray-600">Please review your resume and update it with your latest projects. This message was sent on July 15, 2025.</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <p className="font-semibold text-gray-800">Welcome to XYZ Corp!</p>
                            <p className="text-sm text-gray-600">Your internship has been approved. Please check the 'Documents' section to see what's next. This message was sent on July 10, 2025.</p>
                        </div>
                        {/* More messages would go here */}
                    </div>
                </div>
            );
        }
        return null;
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl text-gray-700">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8"> {/* Main container */}

                {/* 1. Welcome Banner */}
                <div className="bg-red-800 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold">Welcome back Intern!</h2>
                </div>

                {/* 2. Main content container for Name, Buttons, and Dynamic Box */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col md:flex-row md:space-x-8">
                    {/* Left Section: Intern Name and Buttons */}
                    <div className="flex flex-col items-start w-full md:w-1/6 mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 whitespace-nowrap"> Intern lastname, firstname, midllename (student number)</h3>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => setActiveView('status')}
                                className={`text-sm px-20 py-2 rounded-md border transition-colors ${activeView === 'status' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600 hover:bg-red-300'}`}
                            >
                                Status
                            </button>
                            <button
                                onClick={() => setActiveView('inbox')}
                                className={`text-sm px-20 py-2 rounded-md border transition-colors ${activeView === 'inbox' ? 'bg-red-600 text-white' : 'text-red-600 border-red-600 hover:bg-red-300'}`}
                            >
                                Inbox
                            </button>
                        </div>
                    </div>

                    {/* Right Section: The dynamic box for Status or Inbox content */}
                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex-1 mt-[2.5rem]">
                        {renderRightBoxContent()}
                    </div>
                </div>

                {/* Internship Details */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Internship Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p><span className="font-medium">Company:</span> {internData.companyDetails.companyName}</p>
                            <p><span className="font-medium">Supervisor:</span> {internData.companyDetails.supervisor}</p>
                        </div>
                        <div>
                            <p><span className="font-medium">Start Date:</span> {internData.companyDetails.startDate}</p>
                            <p><span className="font-medium">End Date:</span> {internData.companyDetails.endDate}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p><span className="font-medium">Hours Required:</span> {internData.companyDetails.hoursRequired} hrs</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HomeI;