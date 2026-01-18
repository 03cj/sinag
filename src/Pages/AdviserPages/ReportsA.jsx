import { ClipboardCheck, FileCheck, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GenerateReports = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [adviserProgram, setAdviserProgram] = useState(null);

  // Fetch adviser's program on component mount
  useEffect(() => {
    const fetchAdviserProgram = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch adviser info');

        const user = await res.json();
        if (user.program) {
          setAdviserProgram(user.program);
        } else {
          setError('Your adviser account has no program assigned.');
        }
      } catch (err) {
        console.error('Error fetching adviser program:', err);
        setError('Failed to load your program information.');
      }
    };

    fetchAdviserProgram();
  }, []);

  const reportCards = [
    {
      id: 'interns-by-hte',
      title: 'INTERN IN HTE',
      icon: <UserCheck size={32} />,
      description: 'List of interns currently placed in Host Training Establishments.',
      endpoint: '/api/reports/interns-by-hte',
    },
    {
      id: 'intern-documents',
      title: 'INTERN SUBMITTED DOCS',
      icon: <FileCheck size={32} />,
      description: 'Tracking and verification of submitted internship requirements.',
      endpoint: '/api/reports/intern-documents',
    },
    {
      id: 'intern-evaluations',
      title: 'INTERN WITH AVERAGE EVAL',
      icon: <ClipboardCheck size={32} />,
      description: 'Summary of performance ratings and average evaluation scores.',
      endpoint: '/api/reports/intern-evaluations',
    },
    // {
    //   id: 'endorsement-letter',
    //   title: 'ENDORSEMENT LETTER',
    //   icon: <ClipboardCheck size={32} />,
    //   description: 'Generate a standard endorsement letter for interns in your program.',
    //   type: 'endorsement',
    // },
  ];

  // const generateEndorsementLetter = () => {
  //   try {
  //     if (!adviserProgram) {
  //       setError('Program information not loaded. Please try again.');
  //       return;
  //     }
  //
  //     const doc = new jsPDF();
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     let y = 25;
  //     const today = new Date().toLocaleDateString();
  //
  //     doc.setFont('helvetica', 'bold');
  //     doc.setFontSize(18);
  //     doc.text('ENDORSEMENT LETTER', pageWidth / 2, y, { align: 'center' });
  //
  //     y += 15;
  //     doc.setFontSize(11);
  //     doc.setFont('helvetica', 'normal');
  //     doc.text(`Date: ${today}`, 20, y);
  //
  //     y += 15;
  //     doc.text('To Whom It May Concern,', 20, y);
  //
  //     y += 12;
  //     const body = [
  //       `This letter serves to endorse interns under the ${adviserProgram} program for on-the-job training/practicum placement.`,
  //       'These students are recommended to engage with your organization to further develop professional competencies,',
  //       'apply academic learning in real-world settings, and fulfill institutional training requirements.',
  //       'We respectfully request your consideration in accommodating our interns and providing opportunities for practical exposure.',
  //     ];
  //
  //     const bodyLines = doc.splitTextToSize(body.join(' '), pageWidth - 40);
  //     doc.text(bodyLines, 20, y);
  //
  //     y += bodyLines.length * 6 + 18;
  //     doc.text('Thank you for your support.', 20, y);
  //
  //     y += 18;
  //     doc.setFont('helvetica', 'bold');
  //     doc.text('Adviser', 20, y);
  //
  //     doc.save(`Endorsement_${adviserProgram.replace(/\s+/g, '_')}.pdf`);
  //   } catch (err) {
  //     console.error('❌ Endorsement generation error:', err);
  //     setError('Failed to generate endorsement letter');
  //   }
  // };

  const handleGenerateReport = async (report) => {
    // Endorsement generation temporarily disabled
    // if (report.type === 'endorsement') {
    //   generateEndorsementLetter();
    //   return;
    // }

    setLoading(report.id);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(null);
        return;
      }

      if (!adviserProgram) {
        setError('Program information not loaded. Please try again.');
        setLoading(null);
        return;
      }

      const res = await fetch(`${API_BASE_URL}${report.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ program: adviserProgram }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to generate ${report.title} report`);
      }

      const blob = await res.blob();
      window.open(URL.createObjectURL(blob));
    } catch (err) {
      console.error('❌ Report generation error:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GENERATE REPORTS</h1>
        <div style={styles.underline}></div>
      </header>

      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
        </div>
      )}

      <div style={styles.horizontalWrapper}>
        <div style={styles.flexContainer}>
          {reportCards.map((card, index) => (
            <div key={index} style={styles.card} className="report-card">
              <div style={styles.iconContainer}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <button
                onClick={() => handleGenerateReport(card)}
                disabled={loading !== null}
                style={{
                  ...styles.button,
                  opacity: loading === card.id ? 0.7 : 1,
                  cursor: loading !== null ? 'not-allowed' : 'pointer',
                }}
              >
                {loading === card.id ? 'Generating...' : 'Generate PDF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          .report-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            min-width: 280px; 
            max-width: 350px;
          }
          .report-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(128, 0, 0, 0.15) !important;
            border-color: #FFD700 !important;
          }
          .report-card:hover button {
            background-color: #a00000;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    padding: '80px 20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    color: '#800000', // PUP Maroon
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '1.5px',
    margin: '0',
  },
  underline: {
    width: '60px',
    height: '5px',
    backgroundColor: '#FFD700', // PUP Gold
    margin: '15px auto',
    borderRadius: '10px',
  },
  errorContainer: {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    backgroundColor: '#fee',
    border: '1px solid #f99',
    borderRadius: '8px',
    padding: '16px',
  },
  errorText: {
    color: '#c00',
    margin: '0',
    fontSize: '0.95rem',
  },
  horizontalWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px',
  },
  card: {
    flex: '1',
    backgroundColor: '#fff',
    border: '1.5px solid #f0f0f0',
    borderRadius: '20px',
    padding: '40px 25px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  iconContainer: {
    color: '#800000',
    marginBottom: '25px',
    backgroundColor: '#fff1f1',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    color: '#1a1a1a',
    fontSize: '1rem',
    fontWeight: '800',
    marginBottom: '15px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    lineHeight: '1.3',
  },
  cardDescription: {
    color: '#666666',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '30px',
    flexGrow: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#800000',
    color: '#ffffff',
    border: 'none',
    padding: '12px 0',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
};

export default GenerateReports;
