export default function Success() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎉 Payment Completed!</h1>
        <p style={styles.subtitle}>Thank you for your purchase.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '40vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: '1rem',
  },
  card: {
    background: '#ffffff',
    padding: '2rem 3rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#4CAF50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
  },
};
