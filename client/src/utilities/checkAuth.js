const checkAuth = async (token, signal) => {
    if (!token) return false;
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            signal,
        });
        return res.ok; // true إذا status في نطاق 200-299
    } catch (err) {
        if (err.name === "AbortError") return false;
        console.error("checkAuth error", err);
        return false;
    }
};
export default checkAuth;








// #################################################
// import { toast } from "react-toastify";
// const checkAuth = async () => {
//     try {
//         const res = await fetch(`http://localhost:3000/auth/check`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });

//         if (res.status !== 200) {
//             console.warn("Request failed with status:", res.status);
//             toast.error("you are not authorized");
//             // if (navigate) navigate("/login");
//             return false;
//         }

//         const data = await res.json();
//         console.log("data:", data);
//         return true;
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("An error occurred on server");
//         // if (navigate) navigate("/login");
//         return false;
//     }
// };

// export default checkAuth;