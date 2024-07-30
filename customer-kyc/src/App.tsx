import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/auth/auth';
import KYC from './components/customer/kyc';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/layout/layout';

const App: FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<KYC />} />
        </Route>
      </Routes>
    </Layout>
  </Router>
);

export default App;
