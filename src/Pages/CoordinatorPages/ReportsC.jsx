import axios from 'axios';
import { Building2, ChevronRight, ClipboardCheck, FileCheck, GraduationCap, UserCheck, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const GenerateReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(null);

  useEffect(() => {
    if (!selectedReport) return;

    setLoadingPrograms(true);

    const token = localStorage.getItem('token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    axios
      .get(`${API_BASE}/api/dashboard/adviser-programs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPrograms(res.data);
      })
      .catch((err) => {
        console.error('Failed to load programs', err);
      })
      .finally(() => {
        setLoadingPrograms(false);
      });
  }, [selectedReport]);

  const reportCards = [
    {
      title: 'LIST OF INTERNS',
      icon: <Users size={24} />,
      description: 'Master list of all registered interns.',
      requiresProgram: true,
    },
    {
      title: 'LIST OF ACTIVE HTE',
      icon: <Building2 size={24} />,
      description: 'Partner companies and establishments.',
      requiresProgram: false,
    },

    {
      title: 'INTERNS ASSIGNED TO HTE',
      icon: <UserCheck size={24} />,
      description: 'Company placement and status.',
      requiresProgram: true,
    },
    {
      title: 'INTERNS SUBMITTED DOCUMENTS',
      icon: <FileCheck size={24} />,
      description: 'Tracking of required paperwork.',
      requiresProgram: true,
    },
    {
      title: 'LIST OF ADVISER',
      icon: <GraduationCap size={24} />,
      description: 'Faculty advisers assigned to programs.',
      requiresProgram: false,
    },
    {
      title: 'INTERNS EVALUATION',
      icon: <ClipboardCheck size={24} />,
      description: 'Performance reviews and final grades.',
      requiresProgram: true,
    },
  ];

  const handleCardClick = (card) => {
    if (card.requiresProgram) {
      setSelectedReport(card.title);
    } else {
      generateGeneralReport(card.title);
    }
  };

  const handleProgramSelect = async (program) => {
    setGeneratingReport(selectedReport);
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let endpoint = '';

      switch (selectedReport) {
        case 'LIST OF INTERNS':
          endpoint = '/api/reports/students';
          break;
        case 'LIST OF ACTIVE HTE':
          endpoint = '/api/reports/hte-list';
          break;

        case 'INTERNS ASSIGNED TO HTE':
          endpoint = '/api/reports/interns-by-hte';
          break;

        case 'INTERNS SUBMITTED DOCUMENTS':
          endpoint = '/api/reports/intern-documents';
          break;

        case 'INTERNS EVALUATION':
          endpoint = '/api/reports/intern-evaluations';
          break;

        default:
          throw new Error('Unknown report type');
      }

      const response = await axios.post(
        `${API_BASE}${endpoint}`,
        { program },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        },
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
      setSelectedReport(null);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGeneratingReport(null);
    }
  };

  const generateGeneralReport = async (reportTitle) => {
    setGeneratingReport(reportTitle);
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      let endpoint = '';

      switch (reportTitle) {
        case 'LIST OF ACTIVE HTE':
          endpoint = '/api/reports/hte-list';
          break;

        case 'LIST OF ADVISER':
          endpoint = '/api/reports/advisers';
          break;

        default:
          throw new Error('Unknown general report');
      }

      const response = await axios.get(`${API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      window.open(URL.createObjectURL(blob));
    } catch (err) {
      console.error('General report failed:', err);
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GENERATE REPORTS</h1>
        <div style={styles.underline}></div>
      </header>

      <div style={styles.horizontalWrapper}>
        <div style={styles.flexContainer}>
          {reportCards.map((card, index) => (
            <div key={index} style={styles.card} className="report-card" onClick={() => handleCardClick(card)}>
              <div style={styles.iconContainer}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <button
                style={{
                  ...styles.button,
                  opacity: generatingReport !== null ? 0.7 : 1,
                  cursor: generatingReport !== null ? 'not-allowed' : 'pointer',
                }}
                disabled={generatingReport !== null}
              >
                {generatingReport === card.title
                  ? 'Generating...'
                  : card.requiresProgram
                    ? 'Select Program'
                    : 'Generate PDF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Program Selection Modal */}
      {selectedReport && (
        <div style={styles.modalOverlay} onClick={() => setSelectedReport(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Select Program</h2>
              <button onClick={() => setSelectedReport(null)} style={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <p style={styles.modalSubtitle}>
              Generating report for: <strong>{selectedReport}</strong>
            </p>

            <div style={styles.programListContainer} className="custom-scrollbar">
              {loadingPrograms && <p>Loading programs...</p>}

              {!loadingPrograms && programs.length === 0 && <p>No programs assigned to you.</p>}

              {!loadingPrograms &&
                programs.map((program) => (
                  <button
                    key={program}
                    style={styles.programListItem}
                    className="program-list-btn"
                    onClick={() => handleProgramSelect(program)}
                  >
                    <span>{program}</span>
                    <ChevronRight size={18} opacity={0.5} />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .report-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            min-width: 175px;
          }
          .report-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(128, 0, 0, 0.15) !important;
            border-color: #FFD700 !important;
          }
          .report-card:hover button { background-color: #a00000; }

          .program-list-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 16px 20px;
            margin-bottom: 8px;
            background: #fff;
            border: 1px solid #eee;
            border-radius: 10px;
            color: #333;
            font-weight: 600;
            font-size: 0.9rem;
            text-align: left;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .program-list-btn:hover {
            background-color: #fff8f8;
            border-color: #800000;
            color: #800000;
            padding-left: 25px; /* Slight slide effect */
          }

          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; borderRadius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; borderRadius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px 20px',
    backgroundColor: '#fcfcfc',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  header: { textAlign: 'center', marginBottom: '50px' },
  title: { color: '#800000', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '1px', margin: '0' },
  underline: { width: '50px', height: '5px', backgroundColor: '#FFD700', margin: '12px auto', borderRadius: '10px' },
  horizontalWrapper: { width: '100%', maxWidth: '1600px', margin: '0 auto', overflowX: 'auto', paddingBottom: '20px' },
  flexContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '15px', padding: '10px' },
  card: {
    flex: '1',
    backgroundColor: '#fff',
    border: '1px solid #f0f0f0',
    borderRadius: '16px',
    padding: '30px 15px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
  },
  iconContainer: {
    color: '#800000',
    marginBottom: '15px',
    backgroundColor: '#fff1f1',
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#111',
    fontSize: '0.75rem',
    fontWeight: '800',
    marginBottom: '12px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
  },
  cardDescription: { color: '#777', fontSize: '0.7rem', lineHeight: '1.5', marginBottom: '25px', flexGrow: 1 },
  button: {
    width: '100%',
    backgroundColor: '#800000',
    color: '#fff',
    border: 'none',
    padding: '10px 0',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.7rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },

  // List-Style Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '35px',
    borderRadius: '20px',
    width: '95%',
    maxWidth: '600px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  modalTitle: { color: '#800000', margin: 0, fontSize: '1.6rem', fontWeight: '900' },
  modalSubtitle: {
    color: '#666',
    fontSize: '0.95rem',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' },
  programListContainer: { maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }, // The scrollable list
};

export default GenerateReports;
