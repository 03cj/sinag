import { ClipboardCheck, FileCheck, UserCheck } from 'lucide-react';

const GenerateReports = () => {
  const reportCards = [
    {
      title: 'INTERN IN HTE',
      icon: <UserCheck size={32} />,
      description: 'List of interns currently placed in Host Training Establishments.',
    },
    {
      title: 'INTERN SUBMITTED DOCS',
      icon: <FileCheck size={32} />,
      description: 'Tracking and verification of submitted internship requirements.',
    },
    {
      title: 'INTERN WITH AVERAGE EVAL',
      icon: <ClipboardCheck size={32} />,
      description: 'Summary of performance ratings and average evaluation scores.',
    },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>GENERATE REPORTS</h1>
        <div style={styles.underline}></div>
      </header>

      <div style={styles.horizontalWrapper}>
        <div style={styles.flexContainer}>
          {reportCards.map((card, index) => (
            <div key={index} style={styles.card} className="report-card">
              <div style={styles.iconContainer}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
              <button style={styles.button}>Generate PDF</button>
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
