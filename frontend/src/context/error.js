import { useContext, createContext, useState } from 'react';
import Error from '../components/Error';

const ErrorContext = createContext();

export function useError() {
  return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const show = (err) => {
    setError(err);
    return <Error error={err} isError={true} />;
  };

  return (
    <ErrorContext.Provider value={{ error, show }}>
      {children}
    </ErrorContext.Provider>
  );
}
