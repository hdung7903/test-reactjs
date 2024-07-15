import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import LoginPage from '../Pages/auth/LoginPage'
import RegisterPage from '../Pages/auth/RegisterPage'
import ForgotPasswordPage from '../Pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../Pages/auth/ResetPasswordPage'
import HomePage from '../Pages/admin/HomePage'
import AdminPage from '../Pages/admin/AdminPage'
import UsersListPage from '../Pages/admin/UsersListPage'
import FormAddPage from '../Pages/admin/FormAddPage'
import FileAddPage from '../Pages/admin/FileAddPage'
import AcademicPage from '../Pages/academic/AcademicPage'
import InstructorPage from '../Pages/instructor/InstructorPage'
import StudentPage from '../Pages/student/StudentPage'
import ProfilePage from '../Pages/user/ProfilePage'
import MessagePage from '../Pages/user/MessagePage'
import TestMessagePage from '../Pages/user/TestPage'


export default function PublicRoute() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password/:token/:email' element={<ResetPasswordPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/message" element={<MessagePage />} />
            <Route path="/test" element={<TestMessagePage />} />
            <Route path="/admin" element={<AdminPage />}>
                <Route path="home" element={<HomePage />} />
                <Route path="manage/users" element={<UsersListPage />} />
                <Route path="form-add" element={<FormAddPage />} />
                <Route path="file-add" element={<FileAddPage />} />
            </Route>
            <Route path="/acad" element={<AcademicPage />} >
            </Route>
            <Route path="/instructor" element={<InstructorPage />} >
            </Route>
            <Route path="/student" element={<StudentPage />} >
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    )
}
