import loadable from '@loadable/component';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// code splitting - pages directory 단위 기준
const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      {/* nested routing을 위해 와일드카드 사용 */}
      <Route path="/workspace/:workspace/channel/:channel" element={<Workspace />} />
      <Route path="/workspace/:workspace/*" element={<Workspace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
