// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';


// const Navbar = ({ username }) => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   return (
//     <nav className="bg-blue-600 text-white flex justify-between p-4">
//       <div className="flex items-center">
//         <h1 className="text-xl font-bold mr-6">TaskHub</h1>
//         <Link to="/" className="mr-4">Home</Link>
//         <Link to="/login" className="mr-4">Login</Link>
//         <Link to="/register" className="mr-4">Register</Link>
//         <Link to="/tasks" className="mr-4">Tasks</Link>
//       </div>
//       <div>
//         {username && (
//           <>
//             Hello, {username}!
//             <button onClick={logout} className="ml-4 px-3 py-1 bg-white text-blue-600 rounded">Logout</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
