import Header from "./components/header";

import MeetingList from "./components/list";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"  element={<MeetingList />} />
        {/* <Route path="/meet/:meetingId" exact element={<MeetingView />}/> */}
        {/* <Route path="/meet/new"h element={<MeetingView />}/> */}
        {/* <Route path="/meet/:meetingId/edit" element={<MeetingView />}/> */}
      </Routes>
    </>
  );
}

export default App;
