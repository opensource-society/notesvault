import type { RouteObject } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Notes from '@/pages/Notes';
import JotPad from '@/pages/JotPad';
import TodoList from '@/pages/TodoList';
import StudyTracker from '@/pages/StudyTracker';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Upload from '@/pages/Upload';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/notes',
    element: <Notes />,
  },
  {
    path: '/jotpad',
    element: <JotPad />,
  },
  {
    path: '/todos',
    element: <TodoList />,
  },
  {
    path: '/study',
    element: <StudyTracker />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/upload',
    element: <Upload />,
  },
];
