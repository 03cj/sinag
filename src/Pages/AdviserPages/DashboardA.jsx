import React, { useState, useEffect, useRef } from 'react';
import Endorsement from './Endorsement'; 
import AddIntern from './AddIntern'; 


const StatusDropdown = ({ intern, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showRemarkInput, setShowRemarkInput] = useState(false);
    const [remark, setRemark] = useState(intern.remarks || '');
    const dropdownRef = useRef(null);
    const remarkInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showRemarkInput && remarkInputRef.current) {
            remarkInputRef.current.focus();
        }
    }, [showRemarkInput]);

    const getStatusButtonClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-500 hover:bg-green-600';
            case 'Declined':
            case 'Disapproved':
                return 'bg-red-500 hover:bg-red-600';
            case 'Awaiting Review':
            case 'Pending':
            default:
                return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                );
            case 'Declined':
            case 'Disapproved':
            case 'Awaiting Review':
            case 'Pending':
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const handleOptionClick = (newStatus) => {
        setIsOpen(false);

        if (newStatus === 'Disapproved') {
            setShowRemarkInput(true);
        } else {
            onStatusChange(intern.studNo, newStatus);
            setShowRemarkInput(false);
            setRemark('');
        }
    };

    const handleRemarkSubmit = () => {
        if (remark.trim()) {
            onStatusChange(intern.studNo, 'Disapproved', remark.trim());
            setShowRemarkInput(false);
        } else {
            alert('Please enter a remark for disapproval.');
        }
    };

    const handleRemarkCancel = () => {
        setShowRemarkInput(false);
        setRemark(intern.remarks || '');
    };

    const menuOptions = ['Pending', 'Approved', 'Disapproved'];

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {!showRemarkInput ? (
                <>
                    <button
                        type="button"
                        className={`inline-flex justify-center items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${getStatusButtonClass(intern.status)}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        <span>{intern.status}</span>
                        {getStatusIcon(intern.status)}
                    </button>

                    {isOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {menuOptions.map(option => (
                                    <a
                                        key={option}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem"
                                        onClick={(e) => { e.preventDefault(); handleOptionClick(option); }}
                                    >
                                        {option}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        ref={remarkInputRef}
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter remark..."
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleRemarkSubmit();
                            }
                        }}
                    />
                    <div className="flex gap-1 justify-end">
                        <button
                            onClick={handleRemarkSubmit}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleRemarkCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs px-2 py-1 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {intern.status === 'Disapproved' && intern.remarks && !showRemarkInput && (
                <p className="text-red-600 text-xs mt-1 italic max-w-[150px] truncate" title={intern.remarks}>
                    Remark: {intern.remarks}
                </p>
            )}
        </div>
    );
};


const DashboardA = () => {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [internForEndorsement, setInternForEndorsement] = useState(null);
    const [showAddInternForm, setShowAddInternForm] = useState(false);

    const handleStatusChange = (studentNo, newStatus, remark = null) => {
        console.log(`Attempting to set status for Student No: ${studentNo} to: ${newStatus}, Remark: ${remark}`);

        if (newStatus === 'Approved') {
            const approvedIntern = interns.find(intern => intern.studNo === studentNo);
            if (approvedIntern) {
                setInternForEndorsement(approvedIntern);
                alert(`Intern ${studentNo} approved! Please generate endorsement letter.`);
            }
        } else {
            setInterns(prevInterns =>
                prevInterns.map(intern =>
                    intern.studNo === studentNo ? { ...intern, status: newStatus, remarks: remark } : intern
                )
            );
            alert(`Status for Intern ${studentNo} updated to ${newStatus}. ${remark ? `Remark: ${remark}` : ''} (mock action).`);
        }
    };

    const handleGenerateEndorsementLetter = ({ intern, companyDetails, hrDetails }) => {
        console.log("Generating endorsement letter with:", { intern, companyDetails, hrDetails });
        // This is where your actual backend API call for letter generation would go
        alert(`Endorsement letter for ${intern.firstname} ${intern.lastname} generated for ${companyDetails.companyName} with HR ${hrDetails.hrName}!`);

        // After successful generation, remove the intern from the list
        setInterns(prevInterns => prevInterns.filter(i => i.studNo !== intern.studNo));
        setInternForEndorsement(null); // Close the endorsement form
    };

    const handleCloseEndorsementForm = () => {
        setInternForEndorsement(null); // Close the endorsement form
    };

    const handleDocumentClick = (docType, studentNo) => {
        console.log(`Viewing ${docType} for Student No: ${studentNo}`);
        alert(`Opening ${docType} document for ${studentNo}.`);
    };

    const handleAddNewIntern = (newIntern) => {
        console.log('Adding new intern:', newIntern);
        setInterns(prevInterns =>[...prevInterns, newIntern]);
        setShowAddInternForm(false);
        alert(`Intern ${newIntern.firstname} ${newIntern.lastname} has been added. `);
    };

    useEffect(() => {
        const fetchInternsDocuments = async () => {
            setLoading(true);
            setError(null);

            try {
                const mockInterns = [
                    {
                        studNo: '111', lastname: 'Dela Cruz', firstname: 'Juan', mi: 'S.',
                        goodMoral: '/docs/juan_good_moral.pdf', cor: '/docs/juan_cor.pdf',
                        medicalClearance: '/docs/juan_medical.pdf', insurance: '/docs/juan_insurance.pdf',
                        resume: '/docs/juan_resume.pdf', status: 'Pending', remarks: null
                    },
                    {
                        studNo: '112', lastname: 'Reyes', firstname: 'Maria', mi: 'L.',
                        goodMoral: '/docs/maria_good_moral.pdf', cor: '/docs/maria_cor.pdf',
                        medicalClearance: '/docs/maria_medical.pdf', insurance: '/docs/maria_insurance.pdf',
                        resume: '/docs/maria_resume.pdf', status: 'Approved', remarks: null
                    },
                    {
                        studNo: '113', lastname: 'Santos', firstname: 'Pedro', mi: 'A.',
                        goodMoral: '/docs/pedro_good_moral.pdf', cor: '/docs/pedro_cor.pdf',
                        medicalClearance: '/docs/pedro_medical.pdf', insurance: '/docs/pedro_insurance.pdf',
                        resume: '/docs/pedro_resume.pdf', status: 'Pending', remarks: null
                    },
                    {
                        studNo: '114', lastname: 'Lim', firstname: 'Chen', mi: 'P.',
                        goodMoral: '/docs/chen_good_moral.pdf', cor: '/docs/chen_cor.pdf',
                        medicalClearance: '/docs/chen_medical.pdf', insurance: '/docs/chen_insurance.pdf',
                        resume: '/docs/chen_resume.pdf', status: 'Disapproved', remarks: 'Missing signature on COR.'
                    },
                    {
                        studNo: '115', lastname: 'Tan', firstname: 'Kevin', mi: 'C.',
                        goodMoral: '/docs/kevin_good_moral.pdf', cor: '/docs/kevin_cor.pdf',
                        medicalClearance: '/docs/kevin_medical.pdf', insurance: '/docs/kevin_insurance.pdf',
                        resume: '/docs/kevin_resume.pdf', status: 'Pending', remarks: null
                    },
                ];

                await new Promise(resolve => setTimeout(resolve, 800));

                let filteredInterns = mockInterns.filter(intern => {
                    const matchSearch = searchTerm ?
                        `${intern.firstname} ${intern.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) :
                        true;
                    return matchSearch && intern.status !== "Approved";
                });


                setInterns(filteredInterns);

            } catch (err) {
                console.error("Failed to fetch interns' documents:", err);
                setError("Failed to load intern documents. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInternsDocuments();
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="p-5 md:p-8 bg-gray-100 min-h-screen">
            {/* Header and Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-5 mb-8 border border-gray-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Intern Documents</h1>
                        <p className="text-gray-600 text-sm">Review intern submission documents</p>
                    </div>

            <div className ="flex items-center gap-4">
            <button
              onClick={() => setShowAddInternForm(true)}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Add Intern
            </button>
                    
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by student name"
                            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-full"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {/* Interns Documents Table Container */}
            <div className="bg-white rounded-lg shadow-md border border-gray-300">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tl-lg">
                                Stud. no.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Lastname
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Firstname
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                MI.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Good Moral
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                COR
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Medical Clearance
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Insurance
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Resume
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider rounded-tr-lg">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    Loading intern documents...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : interns.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    No intern documents found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            interns.map((intern) => (
                                <tr key={intern.studNo}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.studNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.lastname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.firstname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.mi}</td>
                                    {/* Document Columns */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {intern.goodMoral ? (
                                            <a href={intern.goodMoral} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                .pdf
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {intern.cor ? (
                                            <a href={intern.cor} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                .pdf
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {intern.medicalClearance ? (
                                            <a href={intern.medicalClearance} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                .pdf
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {intern.insurance ? (
                                            <a href={intern.insurance} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                .pdf
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {intern.resume ? (
                                            <a href={intern.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                .pdf
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    {/* Status Column (using the new StatusDropdown component) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <StatusDropdown intern={intern} onStatusChange={handleStatusChange} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Endorsement Form Modal/Component */}
            {internForEndorsement && (
                <Endorsement
                    intern={internForEndorsement}
                    onGenerateLetter={handleGenerateEndorsementLetter}
                    onClose={handleCloseEndorsementForm}
                />
            )}
            {showAddInternForm && (
            <div className="fixed inset-0 bg-red-400/20 backdrop-blur-md flex items-center justify-center z-50">                
            <AddIntern
                onAddSucess={handleAddNewIntern}
                onCancel={() => setShowAddInternForm(false)}
                />
                </div>
            )}
        </div>
    );
};

export default DashboardA;