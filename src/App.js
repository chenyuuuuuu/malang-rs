import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
//import Header from "./Header";
import Signin from "./pages/Signin";
import Community from './pages/Community';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import Attractions from './pages/Attractions';
import NewAttraction from './pages/NewAttraction';
import MyPage from './pages/MyPage';
import Recommendation from './pages/Recommendation';
import Government from './pages/Government';



function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/recommendation" element={<Recommendation />} />
                <Route path="/government" element={<Government />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:topicName" element={<Community />} />
                <Route path="/newpost" element={<NewPost />} />
                <Route path="/post/:postID" element={<Post />} />
                <Route path="/attractions" element={<Attractions />} />
                <Route path="/newattraction" element={<NewAttraction />} />
                <Route path="/attractions/:topicName" element={<Attractions />} />
                <Route path="/mypage" element={<MyPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
