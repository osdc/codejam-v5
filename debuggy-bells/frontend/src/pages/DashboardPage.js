import { useEffect } from "react";
import { useUserContext } from "../components/context/userContext";
import AddExpense from "../components/Dashboard/AddExpense";
import ExpenseList from "../components/Dashboard/ExpenseList";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg.jpg";
import snowflakes from "../assets/snowflakes.png";

const DashboardPage = () => {
  const { userDetails, loading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!userDetails || userDetails == null)) {
      navigate("/login");
    }
  }, [loading, userDetails]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
     
      {/* Animated Snowflakes */}
      <img className="absolute w-12 h-12 animate-float sf1" src={snowflakes} alt="snowflake" />
      <img className="absolute w-12 h-12 animate-float-delay sf2" src={snowflakes} alt="snowflake" />
      <img className="absolute w-12 h-12 animate-float sf3" src={snowflakes} alt="snowflake" />
      <img className="absolute w-12 h-12 animate-float-delay sf4" src={snowflakes} alt="snowflake" />

      {/* Content Card */}
      <div className="bg-white bg-opacity-45 rounded-lg shadow-lg p-8 w-11/12 md:w-2/3 lg:w-fit  relative z-10 m-8">
        {loading ? (
          <div className="text-lg text-center">Loading..</div>
        ) : (
          <>
            {userDetails && userDetails.Email ? (
              <p className="text-xl font-bold mb-4 text-center">
                Hi, {userDetails.name}
              </p>
            ) : ""}
          
             <button className="font-bold w-12 h-12 bg-gray-100 rounded-md w-fit h-fit p-2 my-2 opacity-75 btn" onClick={()=>navigate("/")}>Home</button>
            <AddExpense />
            {/* <ExpenseList /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
