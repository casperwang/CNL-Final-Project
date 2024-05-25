import Header from "./components/header";

import MeetingList from "./components/list";
import MeetingView from "./components/view";
import MeetingEdit from "./components/edit";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MeetingList />} />
        <Route path="/meet/:meetingId" exact element={<MeetingView />} />
        {/* <Route path="/meet/new"h element={<MeetingView />}/> */}
        <Route path="/meet/:meetingId/edit" element={<MeetingEdit />} />
      </Routes>
    </>
  );
}

export default App;
